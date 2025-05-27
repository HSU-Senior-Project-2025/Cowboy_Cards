import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const IMAGE_SIZE = 256; // Size of the image in pixels

export default function LoginStreakCard(props) {
  const [frame, setFrame] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.7,
    triggerOnce: true,
  });

  useEffect(() => {
    let delay = 1000;
    if (inView) {
      const timer = setTimeout(() => setFrame(frame + 1), (delay *= 0.75));
      if (frame == props.streak - 1) {
        clearTimeout(timer);
      }
    }
  }, [frame, props.streak, inView]);

  return (
    <IonCard className="md:w-1/2 rounded-lg border shadow-sm">
      <IonCardHeader className="p-6">
        <IonCardTitle className="text-xl font-rye font-semibold text-primary">
          Login Streak
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent
        ref={ref}
        className="py-6 px-0 flex flex-row items-center justify-center gap-8"
      >
        <img
          src={`/frame-${frame}.png`}
          alt="bonsai tree"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
        />
        <span className="text-6xl px-4 font-rye font-extrabold text-[color:--ion-color-primary] tabular-nums -ml-[30%] me:ml-0">
          {frame + 1}
        </span>
      </IonCardContent>
    </IonCard>
  );
}
