import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Play, Pause, Square, SkipForward, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicroinstructionSequencerProps {
  instruction: string;
  currentPhase: "idle" | "fetch" | "decode" | "execute" | "writeback";
  isExecuting: boolean;
  onExecutionStart: () => void;
  onExecutionStop: () => void;
  onRunWithoutAnimation: () => void;
}

interface Microinstruction {
  id: number;
  name: string;
  phase: "fetch" | "decode" | "execute" | "writeback";
  controlSignals: string[];
  duration: number;
}

const MICROINSTRUCTIONS_MAP: Record<string, Microinstruction[]> = {
  "CMP R1, R2": [
    {
      id: 1,
      name: "Fetch Instruction Address",
      phase: "fetch",
      controlSignals: ["PCout", "MARin", "Read", "Select4", "Add", "Zin"],
      duration: 1000
    },
    {
      id: 2,
      name: "Update Program Counter", 
      phase: "fetch",
      controlSignals: ["Zout", "PCin", "Yin", "WMFC"],
      duration: 1000
    },
    {
      id: 3,
      name: "Load Instruction",
      phase: "decode",
      controlSignals: ["MDRout", "IRin"],
      duration: 1000
    },
    {
      id: 4,
      name: "Read R1 to ALU",
      phase: "execute",
      controlSignals: ["R1out", "Yin"],
      duration: 1000
    },
    {
      id: 5,
      name: "Compare R1 with R2",
      phase: "execute", 
      controlSignals: ["R2out", "SelectY", "Sub", "Zin", "End"],
      duration: 1000
    }
  ]
};

export const MicroinstructionSequencer = ({ 
  instruction, 
  currentPhase, 
  isExecuting, 
  onExecutionStart, 
  onExecutionStop,
  onRunWithoutAnimation
}: MicroinstructionSequencerProps) => {
  const [currentMicroinstruction, setCurrentMicroinstruction] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stepMode, setStepMode] = useState(false);

  const microinstructions = MICROINSTRUCTIONS_MAP[instruction] || [];

  useEffect(() => {
    if (isExecuting && !stepMode && microinstructions.length > 0) {
      const currentMicro = microinstructions[currentMicroinstruction];
      if (currentMicro) {
        let progressTimer: NodeJS.Timeout;
        const startTime = Date.now();
        
        const updateProgress = () => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min((elapsed / currentMicro.duration) * 100, 100);
          setProgress(newProgress);
          
          if (newProgress < 100) {
            progressTimer = setTimeout(updateProgress, 50);
          } else {
            // Move to next microinstruction
            if (currentMicroinstruction < microinstructions.length - 1) {
              setCurrentMicroinstruction(prev => prev + 1);
              setProgress(0);
            } else {
              // Execution complete
              onExecutionStop();
              setCurrentMicroinstruction(0);
              setProgress(0);
            }
          }
        };
        
        updateProgress();
        
        return () => {
          if (progressTimer) clearTimeout(progressTimer);
        };
      }
    }
  }, [isExecuting, stepMode, currentMicroinstruction, microinstructions, onExecutionStop]);

  const handleStart = () => {
    if (microinstructions.length > 0) {
      setCurrentMicroinstruction(0);
      setProgress(0);
      onExecutionStart();
    }
  };

  const handleStep = () => {
    if (microinstructions.length > 0) {
      if (currentMicroinstruction < microinstructions.length - 1) {
        setCurrentMicroinstruction(prev => prev + 1);
        setProgress(100);
      } else {
        setCurrentMicroinstruction(0);
        setProgress(0);
      }
    }
  };

  const handleStop = () => {
    onExecutionStop();
    setCurrentMicroinstruction(0);
    setProgress(0);
  };

  if (!instruction) {
    return (
      <Card className="p-6 border-dashed border-2 border-border bg-muted/20">
        <div className="text-center text-muted-foreground font-mono">
          <div className="text-lg mb-2">No instruction selected</div>
          <div className="text-sm">Select an instruction from the editor to begin simulation</div>
        </div>
      </Card>
    );
  }

  const currentMicro = microinstructions[currentMicroinstruction];

  return (
    <div className="space-y-4">
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
          disabled={isExecuting && !stepMode}
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
            <h4 className="font-mono text-sm font-bold text-primary">
              Step {currentMicroinstruction + 1} of {microinstructions.length}
            </h4>
            <span className={cn(
              "text-xs font-mono px-2 py-1 rounded",
              currentMicro.phase === "fetch" ? "bg-phase-fetch/20 text-phase-fetch" :
              currentMicro.phase === "decode" ? "bg-phase-decode/20 text-phase-decode" :
              currentMicro.phase === "execute" ? "bg-phase-execute/20 text-phase-execute" :
              "bg-phase-writeback/20 text-phase-writeback"
            )}>
              {currentMicro.phase.toUpperCase()}
            </span>
          </div>
          
          <div className="font-mono text-lg font-bold text-foreground mb-2">
            {currentMicro.name}
          </div>
          
          <Progress 
            value={progress} 
            className="mb-3 h-2"
          />
          
          <div className="space-y-1">
            <div className="text-xs font-bold text-muted-foreground font-mono">Control Signals:</div>
            <div className="flex flex-wrap gap-1">
              {currentMicro.controlSignals.map((signal, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "text-xs px-2 py-1 rounded font-mono transition-all duration-300",
                    isExecuting ? "bg-cpu-control/20 text-cpu-control animate-signal-flow" : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Microinstruction Timeline */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-foreground font-mono">Microinstruction Sequence</h4>
        <div className="space-y-1">
          {microinstructions.map((micro, idx) => (
            <div
              key={micro.id}
              className={cn(
                "flex items-center p-2 rounded border transition-all duration-300 font-mono",
                idx === currentMicroinstruction 
                  ? "border-primary bg-primary/10" 
                  : idx < currentMicroinstruction 
                    ? "border-cpu-control bg-cpu-control/5 opacity-60" 
                    : "border-border bg-card/30"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3",
                idx === currentMicroinstruction 
                  ? "bg-primary text-primary-foreground animate-terminal-blink" 
                  : idx < currentMicroinstruction 
                    ? "bg-cpu-control text-white" 
                    : "bg-muted text-muted-foreground"
              )}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{micro.name}</div>
                <div className="text-xs text-muted-foreground">
                  {micro.controlSignals.join(" → ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};