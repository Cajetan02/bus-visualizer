import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ExecutionProgressProps {
  currentPhase: "idle" | "fetch" | "decode" | "execute" | "writeback";
  isExecuting: boolean;
  onPhaseChange: (phase: "idle" | "fetch" | "decode" | "execute" | "writeback") => void;
}

const PHASES = [
  { name: "fetch", label: "Instruction Fetch", color: "phase-fetch", description: "Load instruction from memory" },
  { name: "decode", label: "Instruction Decode", color: "phase-decode", description: "Parse instruction and operands" },
  { name: "execute", label: "Execute", color: "phase-execute", description: "Perform the operation" },
  { name: "writeback", label: "Write Back", color: "phase-writeback", description: "Store results to registers/memory" },
] as const;

export const ExecutionProgress = ({ currentPhase, isExecuting, onPhaseChange }: ExecutionProgressProps) => {
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (isExecuting && currentPhase !== "idle") {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setPhaseProgress(progress);
        
        if (progress >= 100) {
          // Move to next phase
          const currentIndex = PHASES.findIndex(p => p.name === currentPhase);
          if (currentIndex < PHASES.length - 1) {
            const nextPhase = PHASES[currentIndex + 1].name as typeof currentPhase;
            onPhaseChange(nextPhase);
          } else {
            // Complete cycle
            setCycleCount(prev => prev + 1);
            onPhaseChange("idle");
          }
          setPhaseProgress(0);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isExecuting, currentPhase, onPhaseChange]);

  useEffect(() => {
    if (isExecuting && currentPhase === "idle") {
      // Start new cycle
      setTimeout(() => onPhaseChange("fetch"), 500);
    }
  }, [isExecuting, currentPhase, onPhaseChange]);

  const getCurrentPhaseIndex = () => {
    return PHASES.findIndex(p => p.name === currentPhase);
  };

  const getOverallProgress = () => {
    if (currentPhase === "idle") return 0;
    const phaseIndex = getCurrentPhaseIndex();
    if (phaseIndex === -1) return 0;
    return ((phaseIndex * 100) + phaseProgress) / PHASES.length;
  };

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card className="p-4 bg-card/30 border-border">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-mono text-sm font-bold text-foreground">Execution Cycle</h4>
          <span className="text-xs font-mono text-muted-foreground">
            Cycle #{cycleCount}
          </span>
        </div>
        <Progress 
          value={getOverallProgress()} 
          className="h-3 mb-2"
        />
        <div className="text-xs text-center font-mono text-muted-foreground">
          {getOverallProgress().toFixed(1)}% Complete
        </div>
      </Card>

      {/* Phase Details */}
      <div className="space-y-2">
        {PHASES.map((phase, idx) => {
          const isActive = phase.name === currentPhase;
          const isCompleted = getCurrentPhaseIndex() > idx;
          const isPending = getCurrentPhaseIndex() < idx;

          return (
            <div
              key={phase.name}
              className={cn(
                "p-3 rounded-lg border-2 transition-all duration-500",
                isActive 
                  ? `border-${phase.color} bg-${phase.color}/10 animate-control-pulse` 
                  : isCompleted 
                    ? "border-cpu-control bg-cpu-control/5" 
                    : "border-border bg-card/20"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono",
                    isActive 
                      ? `bg-${phase.color} text-white animate-terminal-blink` 
                      : isCompleted 
                        ? "bg-cpu-control text-white" 
                        : "bg-muted text-muted-foreground"
                  )}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className={cn(
                      "text-sm font-bold font-mono",
                      isActive ? `text-${phase.color}` : "text-foreground"
                    )}>
                      {phase.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {phase.description}
                    </div>
                  </div>
                </div>

                {/* Phase Status */}
                <div className={cn(
                  "text-xs font-mono px-2 py-1 rounded",
                  isActive ? `bg-${phase.color}/20 text-${phase.color}` :
                  isCompleted ? "bg-cpu-control/20 text-cpu-control" :
                  "bg-muted/20 text-muted-foreground"
                )}>
                  {isActive ? "ACTIVE" : isCompleted ? "DONE" : "PENDING"}
                </div>
              </div>

              {/* Phase Progress Bar */}
              {isActive && (
                <Progress 
                  value={phaseProgress} 
                  className="h-2"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Timing Information */}
      <Card className="p-3 bg-muted/20 border-border">
        <h4 className="text-xs font-bold text-muted-foreground font-mono mb-2">Timing Information</h4>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex justify-between">
            <span>Clock Cycles per Instruction:</span>
            <span className="text-cpu-control">4-6 cycles</span>
          </div>
          <div className="flex justify-between">
            <span>Current Phase Duration:</span>
            <span className="text-secondary">
              {currentPhase === "fetch" ? "2 cycles" :
               currentPhase === "decode" ? "1 cycle" :
               currentPhase === "execute" ? "2-3 cycles" :
               currentPhase === "writeback" ? "1 cycle" :
               "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Bus Transfers:</span>
            <span className="text-cpu-bus">
              {currentPhase === "fetch" ? "2-3" :
               currentPhase === "decode" ? "0" :
               currentPhase === "execute" ? "0-2" :
               currentPhase === "writeback" ? "0-1" :
               "0"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};