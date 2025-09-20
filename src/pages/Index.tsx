import { useState } from "react";
import { CPUArchitecture } from "@/components/cpu/CPUArchitecture";
import { RegisterPanel } from "@/components/cpu/RegisterPanel";
import { InstructionEditor } from "@/components/cpu/InstructionEditor";
import { MicroinstructionSequencer } from "@/components/cpu/MicroinstructionSequencer";
import { Card } from "@/components/ui/card";

type ExecutionPhase = "idle" | "step1" | "step2" | "step3" | "step4" | "step5";

const Index = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<ExecutionPhase>("idle");
  const [axValue, setAxValue] = useState(10);
  const [bxValue, setBxValue] = useState(20);
  const [flags, setFlags] = useState({ carry: false, zero: false, sign: false });

  const handleStartExecution = () => {
    setIsExecuting(true);
    setCurrentPhase("step1");
  };

  const handleStopExecution = () => {
    setIsExecuting(false);
    setCurrentPhase("idle");
  };

  const handleRunWithoutAnimation = () => {
    // Instantly execute CMP AX,BX and update flags
    const result = axValue - bxValue;
    setFlags({
      carry: axValue < bxValue,
      zero: result === 0,
      sign: result < 0
    });
    console.log(`CMP AX(${axValue}), BX(${bxValue}) = ${result}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold font-mono text-primary mb-2">
          Intel 8086 CMP AX,BX Simulator
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground font-mono">
          Single Bus Architecture • 5-Step Microinstruction Execution
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* CPU Architecture */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-border bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold font-mono text-cpu-register mb-4">CPU Architecture</h2>
            <CPUArchitecture 
              currentPhase={currentPhase}
              isExecuting={isExecuting}
            />
          </Card>
        </div>

        {/* Controls and Registers */}
        <div className="space-y-6">
          <Card className="p-6 border-border bg-card/50 backdrop-blur">
            <h2 className="text-lg font-bold font-mono text-cpu-register mb-4">CPU Registers & Flags</h2>
            <RegisterPanel 
              currentPhase={currentPhase} 
              isExecuting={isExecuting}
              axValue={axValue}
              bxValue={bxValue}
              flags={flags}
            />
          </Card>

          <Card className="p-6 border-border bg-card/50 backdrop-blur">
            <h2 className="text-lg font-bold font-mono text-secondary mb-4">Instruction Setup</h2>
            <InstructionEditor
              axValue={axValue}
              bxValue={bxValue}
              onAxChange={setAxValue}
              onBxChange={setBxValue}
            />
          </Card>
        </div>
      </div>

      {/* Microinstruction Sequencer */}
      <div className="max-w-7xl mx-auto mt-6">
        <Card className="p-6 border-border bg-card/50 backdrop-blur">
          <h2 className="text-xl font-bold font-mono text-cpu-memory mb-4">Microinstruction Sequencer</h2>
          <MicroinstructionSequencer
            currentPhase={currentPhase}
            isExecuting={isExecuting}
            onExecutionStart={handleStartExecution}
            onExecutionStop={handleStopExecution}
            onRunWithoutAnimation={handleRunWithoutAnimation}
            onPhaseChange={setCurrentPhase}
            axValue={axValue}
            bxValue={bxValue}
            onFlagsUpdate={setFlags}
          />
        </Card>
      </div>
    </div>
  );
};

export default Index;