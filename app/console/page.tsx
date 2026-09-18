import { GateConsole } from "@/components/gate-console";

export const metadata = {
  title: "Console",
};

export default function ConsolePage() {
  return (
    <div className="pt-8">
      <GateConsole />
    </div>
  );
}
