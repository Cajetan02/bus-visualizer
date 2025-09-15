import { useState } from "react";
import { RegisterPanel } from "@/components/cpu/RegisterPanel";
import { InstructionEditor } from "@/components/cpu/InstructionEditor";
import { MicroinstructionSequencer } from "@/components/cpu/MicroinstructionSequencer";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"idle" | "fetch" | "decode" | "execute" | "writeback">("idle");
  const [selectedInstruction, setSelectedInstruction] = useState<string>("CMP AX, BX");
  const [axValue, setAxValue] = useState(10);
  const [bxValue, setBxValue] = useState(20);
  const [flags, setFlags] = useState({ carry: false, zero: false, sign: false });

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
      // Calculate flags based on AX - BX
      const result = axValue - bxValue;
      const newFlags = {
        carry: axValue < bxValue, // Carry flag set if borrow needed
        zero: result === 0,       // Zero flag set if result is zero
        sign: result < 0          // Sign flag set if result is negative
      };
      setFlags(newFlags);
      setCurrentPhase("execute");
      console.log(`CMP AX(${axValue}), BX(${bxValue}) = ${result}, Flags: C=${newFlags.carry ? 1 : 0} Z=${newFlags.zero ? 1 : 0} S=${newFlags.sign ? 1 : 0}`);
      setTimeout(() => setCurrentPhase("idle"), 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold font-mono text-primary mb-2">
          8086 Microprocessor - CMP AX, BX
        </h1>
        <p className="text-muted-foreground font-mono">
          Single Bus Organization
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Microinstruction Sequencer */}
        <Card className="p-6 border-border bg-card/50">
          <h2 className="text-xl font-bold font-mono text-primary mb-4">Microinstruction Sequencer</h2>
          <MicroinstructionSequencer
            instruction={selectedInstruction}
            currentPhase={currentPhase}
            isExecuting={isExecuting}
            onExecutionStart={handleStartExecution}
            onExecutionStop={handleStopExecution}
            onRunWithoutAnimation={handleRunWithoutAnimation}
            axValue={axValue}
            bxValue={bxValue}
            flags={flags}
            onFlagsUpdate={setFlags}
          />
        </Card>

        {/* Right Column - Registers and Controls */}
        <div className="space-y-6">
          <Card className="p-6 border-border bg-card/50">
            <h2 className="text-xl font-bold font-mono text-primary mb-4">CPU Registers & Flags</h2>
            <RegisterPanel 
              currentPhase={currentPhase} 
              isExecuting={isExecuting}
              axValue={axValue}
              bxValue={bxValue}
              flags={flags}
            />
          </Card>

          <Card className="p-6 border-border bg-card/50">
            <h2 className="text-xl font-bold font-mono text-primary mb-4">Instruction Control</h2>
            <InstructionEditor
              onInstructionSelect={setSelectedInstruction}
              selectedInstruction={selectedInstruction}
              axValue={axValue}
              bxValue={bxValue}
              onAxChange={setAxValue}
              onBxChange={setBxValue}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;