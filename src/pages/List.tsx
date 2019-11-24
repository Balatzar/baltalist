import React, { useState } from "react";
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonActionSheet,
  IonAlert,
  useIonViewWillEnter,
  IonFooter,
  IonInput,
  IonItemDivider,
} from "@ionic/react";
import { RouteComponentProps, useHistory } from "react-router-dom";

interface List {
  id: string;
  name: string;
  text: string;
  checked: boolean;
  entries_id: string;
}

interface ListProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const ListEntry = (props: { list: List; onChange: () => void }) => {
  return (
    <IonItem>
      <IonLabel>
        <h2>{props.list.text}</h2>
      </IonLabel>
      <IonCheckbox
        slot="end"
        checked={props.list.checked}
        onIonChange={props.onChange}
      />
    </IonItem>
  );
};

const List: React.FC<ListProps> = ({ match }) => {
  const [lists, setlist] = useState<List[]>([]);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const alertInitialAtate = { show: false, header: "", message: "" };
  const [showAlert, setShowAlert] = useState(alertInitialAtate);
  const [newEntry, setNewEntry] = useState("");
  const listId = match.params.id;
  const history = useHistory();
  const anyEntries = lists[0] && lists[0].entries_id;

  useIonViewWillEnter(async () => {
    const result = await fetch(`http://localhost:3000/lists/${listId}`);
    const data = await result.json();
    setlist(data);
  });

  const checkEntry = async (checked: boolean, entryId: string) => {
    console.log("check entry " + entryId);
    console.log("check  " + checked);
    const result = await fetch(`http://localhost:3000/entries/${entryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checked,
      }),
    });
    if (result.ok) {
      setlist(
        lists.map(list => {
          if (list.entries_id === entryId) {
            return { ...list, checked };
          }
          return list;
        })
      );
    } else {
      setShowAlert({
        show: true,
        header: result.status.toString(),
        message: result.statusText,
      });
    }
  };

  const deleteList = async () => {
    console.log("delete list");
    const result = await fetch(`http://localhost:3000/lists/${listId}`, {
      method: "DELETE",
    });
    if (result.ok) {
      history.push("/lists");
    } else {
      setShowAlert({
        show: true,
        header: result.status.toString(),
        message: result.statusText,
      });
    }
  };

  const addEntry = async () => {
    console.log("add entry " + newEntry);
    const result = await fetch(`http://localhost:3000/entries/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        list_id: listId,
        text: newEntry,
      }),
    });
    if (result.ok) {
      const data = await result.json();
      setNewEntry("");
      setlist([...lists, data[0]]);
    } else {
      setShowAlert({
        show: true,
        header: result.status.toString(),
        message: result.statusText,
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/lists" />
          </IonButtons>
          <IonTitle>{lists[0] && lists[0].name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {anyEntries ? (
          <IonList>
            {lists
              .filter(l => !l.checked)
              .map((l, i) => {
                return (
                  <ListEntry
                    list={l}
                    key={i}
                    onChange={() => {
                      checkEntry(true, l.entries_id);
                    }}
                  />
                );
              })}
          </IonList>
        ) : null}
        <IonItem>
          <form
            onSubmit={e => {
              e.preventDefault();
              addEntry();
            }}
          >
            <IonInput
              inputmode="text"
              placeholder="new entry"
              value={newEntry}
              onIonChange={e => {
                setNewEntry((e.target as HTMLTextAreaElement).value);
              }}
            ></IonInput>
          </form>
        </IonItem>
        <IonItemDivider></IonItemDivider>
        {anyEntries ? (
          <IonList>
            {lists
              .filter(l => l.checked)
              .map((l, i) => {
                return (
                  <ListEntry
                    list={l}
                    key={i}
                    onChange={() => {
                      checkEntry(false, l.entries_id);
                    }}
                  />
                );
              })}
          </IonList>
        ) : null}
      </IonContent>
      <IonFooter>
        <IonButton
          fill="outline"
          onClick={() => setShowActionSheet(true)}
          expand="block"
        >
          More
        </IonButton>
      </IonFooter>
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={[
          {
            text: "Delete",
            role: "Destructive",
            icon: "Trash",
            handler() {
              deleteList();
            },
          },
        ]}
      ></IonActionSheet>
      <IonAlert
        isOpen={showAlert.show}
        onDidDismiss={() => setShowAlert(alertInitialAtate)}
        header={showAlert.header}
        message={showAlert.message}
        buttons={["OK"]}
      />
    </IonPage>
  );
};

export default List;
