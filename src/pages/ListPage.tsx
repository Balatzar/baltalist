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
  useIonViewWillEnter,
} from "@ionic/react";

interface List {
  id: string;
  name: string;
}

const ListPage: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);

  useIonViewWillEnter(async () => {
    const result = await fetch("http://localhost:3000/lists");
    const data = await result.json();
    setLists(data);
  });
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
        <IonFabButton>
          <IonIcon name="add" />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default ListPage;
