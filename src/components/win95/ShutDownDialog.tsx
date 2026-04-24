import React from "react";
import { Dialog, DialogButton } from "./Dialog";
import flagUrl from "@/assets/win95-flag.png";

type Choice = "shutdown" | "restart" | "msdos" | "logoff";

export const ShutDownDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [choice, setChoice] = React.useState<Choice>("shutdown");


  const apply = () => {
    if (choice === "shutdown" || choice === "restart" || choice === "msdos") {
      window.location.reload();
    } else {
      onClose();
    }
  };

  const Radio = ({ value, label, accel }: { value: Choice; label: string; accel?: number }) => (
    <label className="flex items-center gap-2 cursor-default py-0.5">
      <input
        type="radio"
        name="shutdown"
        checked={choice === value}
        onChange={() => setChoice(value)}
        className="accent-w95-navy"
      />
      <span>
        {accel !== undefined ? (
          <>
            {label.slice(0, accel)}
            <span className="underline">{label[accel]}</span>
            {label.slice(accel + 1)}
          </>
        ) : (
          label
        )}
      </span>
    </label>
  );

  return (
    <Dialog
      title="Shut Down Windows"
      width={380}
      onClose={onClose}
      icon={<img src={flagUrl} alt="" width={16} height={16} className="crisp" />}
      buttons={
        <>
          <DialogButton primary onClick={apply}>
            <span className="underline">Y</span>es
          </DialogButton>
          <DialogButton onClick={onClose}>
            <span className="underline">N</span>o
          </DialogButton>
          <DialogButton onClick={onClose}>
            <span className="underline">H</span>elp
          </DialogButton>
        </>
      }
    >
      <div className="flex gap-3">
        <img src={flagUrl} alt="" width={36} height={36} className="crisp shrink-0" />
        <div>
          <p className="mb-2 font-bold">Are you sure you want to:</p>
          <Radio value="shutdown" label="Shut down the computer?" accel={0} />
          <Radio value="restart" label="Restart the computer?" accel={0} />
          <Radio value="msdos" label="Restart the computer in MS-DOS mode?" accel={10} />
          <Radio value="logoff" label="Close all programs and log on as a different user?" accel={0} />
        </div>
      </div>
    </Dialog>
  );
};
