import { IonInput, IonItem } from '@ionic/react';

export const EditableField = (props) => {
  return (
    <div>
      <IonItem>
        <IonInput
          type={props.type}
          label={props.label}
          name={props.name}
          value={props.value}
          onIonChange={props.onChange}
        />
      </IonItem>
      {props.error && (
        <p className="text-red-500 text-xs mt-1">{props.error}</p>
      )}
    </div>
  );
};
