import { useState } from "react";
import { CPUArchitecture } from "@/components/cpu/CPUArchitecture";
import { RegisterPanel } from "@/components/cpu/RegisterPanel";
import { InstructionEditor } from "@/components/cpu/InstructionEditor";
import { MicroinstructionSequencer } from "@/components/cpu/MicroinstructionSequencer";
import { ExecutionProgress } from "@/components/cpu/ExecutionProgress";
import { ControlSignals } from "@/components/cpu/ControlSignals";
import { MemoryViewer } from "@/components/cpu/MemoryViewer";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"idle" | "fetch" | "decode" | "execute" | "writeback">("idle");
  const [selectedInstruction, setSelectedInstruction] = useState<string>("CMP R1, R2");
  const [r1Value, setR1Value] = useState(10);
  const [r2Value, setR2Value] = useState(20);

  const handleStartExecution = () => {
    setIsExecuting(true);
    setCurrentPhase("fetch");
  };

  const handleStopExecution = () => {
    setIsExecuting(false);
    setCurrentPhase("idle");
  };

  const handleRunWithoutAnimation = () => {
    if (selectedInstruction) {
      // Instantly complete the instruction and show comparison result
      setCurrentPhase("execute");
      const compareResult = r1Value - r2Value;
      console.log(`CMP R1(${r1Value}), R2(${r2Value}) = ${compareResult}`);
      setTimeout(() => setCurrentPhase("idle"), 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card p-4">
      <header className="mb-4 lg:mb-6 text-center px-2">
        <h1 className="text-2xl lg:text-4xl font-bold font-mono text-primary mb-2">
          Intel 8086 Microprocessor Simulator
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground font-mono">
          Single Bus Architecture • Microinstruction Level Simulation
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
        {/* Left Column - CPU Architecture & Controls */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <Card className="p-4 lg:p-6 border-border bg-card/50 backdrop-blur">
            <h2 className="text-lg lg:text-xl font-bold font-mono text-cpu-register mb-4">CPU Architecture</h2>
            <CPUArchitecture 
              currentPhase={currentPhase}
              isExecuting={isExecuting}
              selectedInstruction={selectedInstruction}
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Card className="p-4 lg:p-6 border-border bg-card/50 backdrop-blur">
              <h2 className="text-base lg:text-lg font-bold font-mono text-cpu-control mb-4">Control Signals</h2>
              <ControlSignals currentPhase={currentPhase} isExecuting={isExecuting} />
            </Card>

            <Card className="p-4 lg:p-6 border-border bg-card/50 backdrop-blur">
              <h2 className="text-base lg:text-lg font-bold font-mono text-phase-execute mb-4">Execution Progress</h2>
              <ExecutionProgress 
                currentPhase={currentPhase} 
                isExecuting={isExecuting}
                onPhaseChange={setCurrentPhase}
              />
            </Card>
          </div>

          <Card className="p-4 lg:p-6 border-border bg-card/50 backdrop-blur">
            <h2 className="text-lg lg:text-xl font-bold font-mono text-cpu-memory mb-4">Microinstruction Sequencer</h2>
            <MicroinstructionSequencer
              instruction={selectedInstruction}
              currentPhase={currentPhase}
              isExecuting={isExecuting}
              onExecutionStart={handleStartExecution}
              onExecutionStop={handleStopExecution}
              onRunWithoutAnimation={handleRunWithoutAnimation}
            />
          </Card>
        </div>

        {/* Right Column - Registers, Memory, Instructions */}
        <div className="space-y-4 lg:space-y-6">
          <Card className="p-4 lg:p-6 border-border bg-card/50 backdrop-blur">
            <h2 className="text-base lg:text-lg font-bold font-mono text-cpu-register mb-4">CPU Registers</h2>
            <RegisterPanel 
              currentPhase={currentPhase} 
              isExecuting={isExecuting}
              r1Value={r1Value}
              r2Value={r2Value}
            />
          </Card>

          <Card className="p-4 lg:p-6 border-border bg-card/50 backdrop-blur">
            <h2 className="text-base lg:text-lg font-bold font-mono text-cpu-memory mb-4">Memory Viewer</h2>
            <MemoryViewer currentPhase={currentPhase} />
          </Card>

          <Card className="p-4 lg:p-6 border-border bg-card/50 backdrop-blur">
            <h2 className="text-base lg:text-lg font-bold font-mono text-secondary mb-4">Instruction Editor</h2>
            <InstructionEditor
              onInstructionSelect={setSelectedInstruction}
              selectedInstruction={selectedInstruction}
              r1Value={r1Value}
              r2Value={r2Value}
              onR1Change={setR1Value}
              onR2Change={setR2Value}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;