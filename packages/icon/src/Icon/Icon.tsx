import { IonIcon } from "@ionic/react";
import React from "react";

type IconProps = {
  icon: string;
};

const Icon = React.forwardRef<unknown, IconProps>(({ icon, ...props } ) => {
  return (
    <span className="inline-block h-8 w-8">
      <IonIcon
        icon={icon}
        {...props}
        // will need to do custom icon size tokens here for text, text-icon-1 perhaps
        className="text-red-5 text-[8rem]"
      />
    </span>
  );
});

export { Icon };
