import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RegisterPanelProps {
  currentPhase: "idle" | "fetch" | "decode" | "execute" | "writeback";
  isExecuting: boolean;
  axValue: number;
  bxValue: number;
  flags: { carry: boolean; zero: boolean; sign: boolean };
}

interface RegisterValues {
  AX: number;
  BX: number;
  CX: number;
  DX: number;
  SI: number;
  DI: number;
  SP: number;
  BP: number;
  CS: number;
  DS: number;
  ES: number;
  SS: number;
  IP: number;
  FLAGS: number;
}

export const RegisterPanel = ({ currentPhase, isExecuting, axValue, bxValue, flags }: RegisterPanelProps) => {
  const [registers, setRegisters] = useState<RegisterValues>({
    AX: axValue, BX: bxValue, CX: 0x0000, DX: 0x0000,
    SI: 0x0000, DI: 0x0000, SP: 0xFFFF, BP: 0x0000,
    CS: 0x1000, DS: 0x1000, ES: 0x1000, SS: 0x1000,
    IP: 0x0100, FLAGS: 0x0000
  });

  // Update AX and BX values based on flags
  useEffect(() => {
    const flagsValue = (flags.carry ? 0x0001 : 0) | 
                      (flags.zero ? 0x0040 : 0) | 
                      (flags.sign ? 0x0080 : 0);
    
    setRegisters(prev => ({
      ...prev,
      AX: axValue,
      BX: bxValue,
      FLAGS: flagsValue
    }));
  }, [axValue, bxValue, flags]);

  const [changedRegisters, setChangedRegisters] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentPhase === "execute" && isExecuting) {
      // Simulate register changes during execution
      const timeout = setTimeout(() => {
        setRegisters(prev => ({
          ...prev,
          AX: prev.AX + 0x0001,
          FLAGS: prev.FLAGS | 0x0001
        }));
        setChangedRegisters(new Set(["AX", "FLAGS"]));
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [currentPhase, isExecuting]);

  useEffect(() => {
    if (changedRegisters.size > 0) {
      const timeout = setTimeout(() => {
        setChangedRegisters(new Set());
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [changedRegisters]);

  const formatHex = (value: number) => `0x${value.toString(16).toUpperCase().padStart(4, '0')}`;

  const RegisterRow = ({ name, value, category }: { name: string; value: number; category: string }) => {
    const isChanged = changedRegisters.has(name);
    const isActive = currentPhase === "writeback" && isChanged;

    return (
      <div className={cn(
        "flex justify-between items-center py-2 px-3 rounded transition-all duration-500 font-mono",
        isActive && "animate-register-update bg-cpu-register/20",
        isChanged && "bg-secondary/10"
      )}>
        <span className={cn(
          "text-sm font-bold",
          category === "general" ? "text-cpu-register" :
          category === "segment" ? "text-cpu-memory" :
          category === "pointer" ? "text-cpu-control" :
          "text-accent"
        )}>
          {name}:
        </span>
        <span className={cn(
          "text-sm font-mono",
          isChanged ? "text-secondary animate-terminal-blink" : "text-foreground"
        )}>
          {formatHex(value)}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* General Purpose Registers */}
      <div className="border border-border rounded-lg p-3 bg-card/30">
        <h4 className="text-sm font-bold text-cpu-register mb-2 font-mono">General Purpose</h4>
        <div className="space-y-1">
          <RegisterRow name="AX" value={registers.AX} category="general" />
          <RegisterRow name="BX" value={registers.BX} category="general" />
          <RegisterRow name="CX" value={registers.CX} category="general" />
          <RegisterRow name="DX" value={registers.DX} category="general" />
        </div>
      </div>

      {/* Index & Pointer Registers */}
      <div className="border border-border rounded-lg p-3 bg-card/30">
        <h4 className="text-sm font-bold text-cpu-control mb-2 font-mono">Index & Pointer</h4>
        <div className="space-y-1">
          <RegisterRow name="SI" value={registers.SI} category="pointer" />
          <RegisterRow name="DI" value={registers.DI} category="pointer" />
          <RegisterRow name="SP" value={registers.SP} category="pointer" />
          <RegisterRow name="BP" value={registers.BP} category="pointer" />
        </div>
      </div>

      {/* Segment Registers */}
      <div className="border border-border rounded-lg p-3 bg-card/30">
        <h4 className="text-sm font-bold text-cpu-memory mb-2 font-mono">Segment</h4>
        <div className="space-y-1">
          <RegisterRow name="CS" value={registers.CS} category="segment" />
          <RegisterRow name="DS" value={registers.DS} category="segment" />
          <RegisterRow name="ES" value={registers.ES} category="segment" />
          <RegisterRow name="SS" value={registers.SS} category="segment" />
        </div>
      </div>

      {/* Control Registers */}
      <div className="border border-border rounded-lg p-3 bg-card/30">
        <h4 className="text-sm font-bold text-accent mb-2 font-mono">Control</h4>
        <div className="space-y-1">
          <RegisterRow name="IP" value={registers.IP} category="control" />
          <RegisterRow name="FLAGS" value={registers.FLAGS} category="control" />
        </div>
      </div>

      {/* Status Flags */}
      <div className="border border-border rounded-lg p-3 bg-card/30">
        <h4 className="text-sm font-bold text-accent mb-2 font-mono">Status Flags</h4>
        <div className="grid grid-cols-3 gap-2 text-sm font-mono">
          <div className={cn(
            "flex justify-between p-2 rounded border transition-all duration-300",
            flags.carry ? "border-red-500 bg-red-500/10 text-red-500" : "border-border bg-card/20 text-muted-foreground"
          )}>
            <span className="font-bold">C:</span>
            <span>{flags.carry ? '1' : '0'}</span>
          </div>
          <div className={cn(
            "flex justify-between p-2 rounded border transition-all duration-300",
            flags.zero ? "border-blue-500 bg-blue-500/10 text-blue-500" : "border-border bg-card/20 text-muted-foreground"
          )}>
            <span className="font-bold">Z:</span>
            <span>{flags.zero ? '1' : '0'}</span>
          </div>
          <div className={cn(
            "flex justify-between p-2 rounded border transition-all duration-300",
            flags.sign ? "border-yellow-500 bg-yellow-500/10 text-yellow-500" : "border-border bg-card/20 text-muted-foreground"
          )}>
            <span className="font-bold">S:</span>
            <span>{flags.sign ? '1' : '0'}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground font-mono mt-2">
          Comparison Result: AX({axValue}) - BX({bxValue}) = {axValue - bxValue}
        </div>
      </div>
    </div>
  );
};