import { cn } from "@/lib/utils";

// Execution phases for this simulator
type ExecutionPhase = "idle" | "step1" | "step2" | "step3" | "step4" | "step5";

interface RegisterPanelProps {
  currentPhase: ExecutionPhase;
  isExecuting: boolean;
  axValue: number;
  bxValue: number;
  flags: { carry: boolean; zero: boolean; sign: boolean };
}

export const RegisterPanel = ({ currentPhase, isExecuting, axValue, bxValue, flags }: RegisterPanelProps) => {
  const isRegistersActive = currentPhase === "step4" || currentPhase === "step5";

  const formatHex = (value: number) => `0x${(value & 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0")}`;

  return (
    <div className="space-y-4">
      {/* General Purpose (only AX, BX kept) */}
      <div className="border border-border rounded-lg p-3 bg-card/30">
        <h4 className="text-sm font-bold text-cpu-register mb-2 font-mono">General Purpose</h4>
        <div className="space-y-1">
          <div
            className={cn(
              "flex justify-between items-center py-2 px-3 rounded font-mono transition-all duration-500",
              isExecuting && isRegistersActive && "animate-register-update bg-cpu-register/20"
            )}
          >
            <span className="text-sm font-bold text-cpu-register">AX:</span>
            <span className="text-sm">{formatHex(axValue)}</span>
          </div>
          <div
            className={cn(
              "flex justify-between items-center py-2 px-3 rounded font-mono transition-all duration-500",
              isExecuting && isRegistersActive && "animate-register-update bg-cpu-register/20"
            )}
          >
            <span className="text-sm font-bold text-cpu-register">BX:</span>
            <span className="text-sm">{formatHex(bxValue)}</span>
          </div>
        </div>
      </div>

      {/* Status Flags (only Carry, Zero, Sign) */}
      <div className="border border-border rounded-lg p-3 bg-card/30">
        <h4 className="text-sm font-bold text-accent mb-2 font-mono">Status Flags</h4>
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div
            className={cn(
              "flex justify-between px-2 py-1 rounded",
              flags.carry ? "text-secondary bg-secondary/10" : "text-muted-foreground"
            )}
          >
            <span>CF</span>
            <span>{flags.carry ? "1" : "0"}</span>
          </div>
          <div
            className={cn(
              "flex justify-between px-2 py-1 rounded",
              flags.zero ? "text-secondary bg-secondary/10" : "text-muted-foreground"
            )}
          >
            <span>ZF</span>
            <span>{flags.zero ? "1" : "0"}</span>
          </div>
          <div
            className={cn(
              "flex justify-between px-2 py-1 rounded",
              flags.sign ? "text-secondary bg-secondary/10" : "text-muted-foreground"
            )}
          >
            <span>SF</span>
            <span>{flags.sign ? "1" : "0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};