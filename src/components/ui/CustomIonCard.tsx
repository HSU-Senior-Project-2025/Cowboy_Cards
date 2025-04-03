import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/react';

const CustomIonCard = ({ title, subtitle, content, ...props }) => (
  <IonCard
    className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-lg border shadow-sm"
    {...props}
  >
    <IonCardHeader className="flex flex-col space-y-1.5 p-6">
      <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
        {title}
      </IonCardTitle>
      {subtitle && (
        <IonCardSubtitle className="text-sm text-muted-foreground">
          {subtitle}
        </IonCardSubtitle>
      )}
    </IonCardHeader>
    <IonCardContent>{content}</IonCardContent>
  </IonCard>
);

export default CustomIonCard;
