import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Play, Square, SkipForward, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ExecutionPhase = "idle" | "iac" | "if" | "iod" | "oac" | "of" | "do";

interface MicroinstructionSequencerProps {
  currentPhase: ExecutionPhase;
  isExecuting: boolean;
  onExecutionStart: () => void;
  onExecutionStop: () => void;
  onRunWithoutAnimation: () => void;
  onPhaseChange: (phase: ExecutionPhase) => void;
  axValue: number;
  bxValue: number;
  onFlagsUpdate: (flags: { carry: boolean; zero: boolean; sign: boolean }) => void;
}

interface Microinstruction {
  id: number;
  name: string;
  phase: ExecutionPhase;
  description: string;
  duration: number;
}

const MICROINSTRUCTIONS: Microinstruction[] = [
  {
    id: 1,
    name: "IAC",
    phase: "iac",
    description: "Instruction Address Calculation - Calculate next instruction address",
    duration: 1000
  },
  {
    id: 2,
    name: "IF",
    phase: "if",
    description: "Instruction Fetch - Fetch instruction from memory",
    duration: 1000
  },
  {
    id: 3,
    name: "IOD",
    phase: "iod",
    description: "Instruction Operation Decoding - Decode the CMP instruction",
    duration: 1000
  },
  {
    id: 4,
    name: "OAC",
    phase: "oac",
    description: "Operand Address Calculation - Calculate operand addresses",
    duration: 1000
  },
  {
    id: 5,
    name: "OF",
    phase: "of",
    description: "Operand Fetch - Fetch AX and BX register values",
    duration: 1000
  },
  {
    id: 6,
    name: "DO",
    phase: "do",
    description: "Data Operation - Perform comparison and set flags",
    duration: 1000
  }
];

export const MicroinstructionSequencer = ({ 
  currentPhase, 
  isExecuting, 
  onExecutionStart, 
  onExecutionStop,
  onRunWithoutAnimation,
  onPhaseChange,
  axValue,
  bxValue,
  onFlagsUpdate
}: MicroinstructionSequencerProps) => {
  const [progress, setProgress] = useState(0);

  const currentMicroIndex = MICROINSTRUCTIONS.findIndex(m => m.phase === currentPhase);
  const currentMicro = MICROINSTRUCTIONS[currentMicroIndex];

  useEffect(() => {
    if (isExecuting && currentPhase !== "idle") {
      let progressTimer: NodeJS.Timeout;
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / (currentMicro?.duration || 1000)) * 100, 100);
        setProgress(newProgress);
        
        if (newProgress < 100) {
          progressTimer = setTimeout(updateProgress, 50);
        } else {
          // Move to next phase
          const nextIndex = currentMicroIndex + 1;
          if (nextIndex < MICROINSTRUCTIONS.length) {
            onPhaseChange(MICROINSTRUCTIONS[nextIndex].phase);
            setProgress(0);
          } else {
            // Execute final operation and update flags
            const result = axValue - bxValue;
            onFlagsUpdate({
              carry: axValue < bxValue,
              zero: result === 0,
              sign: result < 0
            });
            // Execution complete
            onExecutionStop();
            onPhaseChange("idle");
            setProgress(0);
          }
        }
      };
      
      updateProgress();
      
      return () => {
        if (progressTimer) clearTimeout(progressTimer);
      };
    }
  }, [isExecuting, currentPhase, currentMicro, onPhaseChange, onExecutionStop, axValue, bxValue, onFlagsUpdate, currentMicroIndex]);

  const handleStart = () => {
    setProgress(0);
    onExecutionStart();
  };

  const handleStep = () => {
    const nextIndex = currentMicroIndex + 1;
    if (nextIndex < MICROINSTRUCTIONS.length) {
      onPhaseChange(MICROINSTRUCTIONS[nextIndex].phase);
      setProgress(100);
    } else {
      const result = axValue - bxValue;
      onFlagsUpdate({
        carry: axValue < bxValue,
        zero: result === 0,
        sign: result < 0
      });
      onPhaseChange("idle");
      setProgress(0);
    }
  };

  const handleStop = () => {
    onExecutionStop();
    onPhaseChange("idle");
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* CMP AX,BX Instruction Display */}
      <div className="text-center p-4 border border-border rounded-lg bg-card/30">
        <h3 className="text-xl font-mono font-bold text-primary mb-2">CMP AX, BX</h3>
        <p className="text-sm text-muted-foreground font-mono">
          Compare AX({axValue}) with BX({bxValue}) • Subtract BX from AX and set flags
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={handleStart}
          disabled={isExecuting}
          variant="default"
          size="sm"
          className="font-mono"
        >
          <Play className="w-4 h-4 mr-1" />
          Execute
        </Button>
        
        <Button
          onClick={handleStep}
          disabled={isExecuting}
          variant="outline"
          size="sm"
          className="font-mono"
        >
          <SkipForward className="w-4 h-4 mr-1" />
          Step
        </Button>
        
        <Button
          onClick={onRunWithoutAnimation}
          disabled={isExecuting}
          variant="secondary"
          size="sm"
          className="font-mono"
        >
          <Zap className="w-4 h-4 mr-1" />
          Run Instant
        </Button>
        
        <Button
          onClick={handleStop}
          disabled={!isExecuting}
          variant="destructive"
          size="sm"
          className="font-mono"
        >
          <Square className="w-4 h-4 mr-1" />
          Stop
        </Button>
      </div>

      {/* Current Microinstruction */}
      {currentMicro && (
        <Card className={cn(
          "p-4 border-2 transition-all duration-300",
          isExecuting ? "border-primary animate-control-pulse" : "border-border",
          "bg-gradient-to-r from-card to-muted/20"
        )}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
            <h4 className="font-mono text-lg font-bold text-primary">
              {currentMicro.name} - Step {currentMicroIndex + 1}/6
            </h4>
            <span className={cn(
              "text-sm font-mono px-3 py-1 rounded font-bold",
              "bg-primary/20 text-primary"
            )}>
              {currentMicro.phase.toUpperCase()}
            </span>
          </div>
          
          <div className="font-mono text-base text-foreground mb-3">
            {currentMicro.description}
          </div>
          
          <Progress 
            value={progress} 
            className="mb-2 h-3"
          />
        </Card>
      )}

      {/* Microinstruction Timeline */}
      <div className="space-y-3">
        <h4 className="text-lg font-bold text-foreground font-mono">6-Step Microinstruction Sequence</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MICROINSTRUCTIONS.map((micro, idx) => {
            const isActive = micro.phase === currentPhase;
            const isCompleted = currentMicroIndex > idx;
            
            return (
              <div
                key={micro.id}
                className={cn(
                  "flex items-center p-3 rounded-lg border-2 transition-all duration-300 font-mono",
                  isActive 
                    ? "border-primary bg-primary/10 animate-control-pulse" 
                    : isCompleted 
                      ? "border-cpu-control bg-cpu-control/5 opacity-70" 
                      : "border-border bg-card/30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3",
                  isActive 
                    ? "bg-primary text-primary-foreground animate-terminal-blink" 
                    : isCompleted 
                      ? "bg-cpu-control text-white" 
                      : "bg-muted text-muted-foreground"
                )}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{micro.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {micro.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};