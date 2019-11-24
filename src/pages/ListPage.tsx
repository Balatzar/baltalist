import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  useIonViewWillEnter,
  IonButton,
  IonInput,
  IonAlert,
} from "@ionic/react";

import { add } from "ionicons/icons";

interface List {
  id: string;
  name: string;
}

const ListPage: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [showModal, setShowModal] = useState(true);
  const alertInitialAtate = { show: false, header: "", message: "" };
  const [showAlert, setShowAlert] = useState(alertInitialAtate);
  let newName = "";

  useIonViewWillEnter(async () => {
    const result = await fetch("http://localhost:3000/lists");
    const data = await result.json();
    setLists(data);
  });

  const createList = async () => {
    const result = await fetch(`http://localhost:3000/lists/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
      }),
    });

    if (result.ok) {
      const data = await result.json();
      setLists([...lists, data[0]]);
      setShowModal(false);
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
          <IonTitle>My lists</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {lists.map(({ id, name }, i) => {
            return (
              <IonItem key={i} routerLink={`/lists/${id}`}>
                <IonLabel>
                  <h2>{name}</h2>
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setShowModal(true)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      <IonModal isOpen={showModal}>
        <IonToolbar>
          <IonTitle>Create a new list</IonTitle>
        </IonToolbar>
        <IonItem>
          <IonLabel position="floating">Name</IonLabel>
          <IonInput
            onIonChange={e => {
              newName = (e.target as HTMLTextAreaElement).value;
            }}
          ></IonInput>
        </IonItem>
        <IonButton onClick={createList}>Create</IonButton>
        <IonButton
          fill="outline"
          onClick={() => {
            setShowModal(false);
          }}
        >
          Close
        </IonButton>
      </IonModal>
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

export default ListPage;
