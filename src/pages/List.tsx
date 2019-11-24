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
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";

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

  useIonViewWillEnter(async () => {
    const result = await fetch(
      `http://localhost:3000/lists/${match.params.id}`
    );
    const data = await result.json();
    setlist(data);
  });

  const checkEntry = async (checked: boolean, entryId: string) => {
    console.log("check entry " + entryId);
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
          if (list.id === entryId) {
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
        <IonButton onClick={() => setShowActionSheet(true)} expand="block">
          Actions
        </IonButton>
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: "Delete",
              role: "Destructive",
              icon: "Trash",
              handler() {
                console.log("Delete");
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
      </IonContent>
    </IonPage>
  );
};

export default List;
