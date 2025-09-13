import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MemoryViewerProps {
  currentPhase: "idle" | "fetch" | "decode" | "execute" | "writeback";
}

interface MemoryCell {
  address: number;
  value: number;
  accessed: boolean;
  modified: boolean;
}

export const MemoryViewer = ({ currentPhase }: MemoryViewerProps) => {
  const [baseAddress, setBaseAddress] = useState(0x1000);
  const [memory, setMemory] = useState<MemoryCell[]>([]);
  const [accessedAddresses, setAccessedAddresses] = useState<Set<number>>(new Set());

  // Initialize memory with sample program
  useEffect(() => {
    const initMemory: MemoryCell[] = [];
    for (let i = 0; i < 32; i++) {
      const addr = baseAddress + i;
      let value = 0x00;
      
      // Sample 8086 program in memory
      if (i === 0) value = 0xB8;  // MOV AX, immediate (high byte)
      if (i === 1) value = 0x00;  // immediate value low byte
      if (i === 2) value = 0x10;  // immediate value high byte
      if (i === 3) value = 0x03;  // ADD AX, BX
      if (i === 4) value = 0xD8;  
      if (i === 5) value = 0xA3;  // MOV [address], AX
      if (i === 6) value = 0x00;  
      if (i === 7) value = 0x20;  
      
      initMemory.push({
        address: addr,
        value,
        accessed: false,
        modified: false
      });
    }
    setMemory(initMemory);
  }, [baseAddress]);

  useEffect(() => {
    if (currentPhase === "fetch") {
      // Simulate memory access during fetch phase
      const timeout = setTimeout(() => {
        setAccessedAddresses(prev => new Set([...prev, baseAddress, baseAddress + 1]));
        setMemory(prev => prev.map(cell => 
          cell.address === baseAddress || cell.address === baseAddress + 1
            ? { ...cell, accessed: true }
            : cell
        ));
      }, 200);
      
      return () => clearTimeout(timeout);
    }
  }, [currentPhase, baseAddress]);

  const formatHex = (value: number, width: number = 4) => 
    `0x${value.toString(16).toUpperCase().padStart(width, '0')}`;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 16) || 0;
    setBaseAddress(value);
    setAccessedAddresses(new Set());
  };

  const getInstructionMnemonic = (opcode: number, operand?: number) => {
    switch (opcode) {
      case 0xB8: return `MOV AX, ${formatHex(operand || 0)}`;
      case 0x03: return "ADD AX, BX";
      case 0xA3: return `MOV [${formatHex(operand || 0)}], AX`;
      case 0xEB: return `JMP ${formatHex(operand || 0)}`;
      case 0x50: return "PUSH AX";
      case 0x58: return "POP AX";
      default: return "???";
    }
  };

  return (
    <div className="space-y-4">
      {/* Memory Address Control */}
      <div className="flex gap-2 items-center">
        <label className="text-xs font-mono text-muted-foreground">Base Address:</label>
        <Input
          value={formatHex(baseAddress)}
          onChange={handleAddressChange}
          className="font-mono text-xs w-24 h-8"
          placeholder="0x1000"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setBaseAddress(0x1000);
            setAccessedAddresses(new Set());
          }}
          className="font-mono text-xs h-8"
        >
          Reset
        </Button>
      </div>

      {/* Memory Contents */}
      <div className="space-y-1 max-h-64 overflow-y-auto border border-border rounded-lg p-2 bg-card/20">
        <div className="grid grid-cols-4 gap-2 text-xs font-mono font-bold text-muted-foreground mb-2 sticky top-0 bg-card/80 backdrop-blur p-1 rounded">
          <span>Address</span>
          <span>Hex</span>
          <span>Binary</span>
          <span>Instruction</span>
        </div>
        
        {memory.map((cell, idx) => {
          const isAccessed = accessedAddresses.has(cell.address);
          const isCurrentPC = cell.address === baseAddress;
          const nextByte = memory[idx + 1];
          
          return (
            <div
              key={cell.address}
              className={cn(
                "grid grid-cols-4 gap-2 text-xs font-mono py-1 px-2 rounded transition-all duration-300",
                isCurrentPC && "bg-primary/10 border border-primary/30",
                isAccessed && "bg-cpu-memory/20 animate-register-update",
                cell.modified && "bg-secondary/20"
              )}
            >
              <span className={cn(
                isCurrentPC ? "text-primary font-bold" : "text-muted-foreground"
              )}>
                {formatHex(cell.address)}
              </span>
              
              <span className={cn(
                "font-bold",
                isAccessed ? "text-cpu-memory" : "text-foreground"
              )}>
                {formatHex(cell.value, 2)}
              </span>
              
              <span className="text-muted-foreground text-xs">
                {cell.value.toString(2).padStart(8, '0')}
              </span>
              
              <span className={cn(
                "text-xs",
                isCurrentPC ? "text-primary font-bold" : "text-muted-foreground"
              )}>
                {idx % 2 === 0 ? getInstructionMnemonic(cell.value, nextByte?.value) : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* Memory Statistics */}
      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-2 border border-border rounded bg-card/30">
          <div className="text-muted-foreground">Memory Accesses</div>
          <div className="text-cpu-memory font-bold">{accessedAddresses.size}</div>
        </div>
        <div className="p-2 border border-border rounded bg-card/30">
          <div className="text-muted-foreground">Current Phase</div>
          <div className={cn(
            "font-bold",
            currentPhase === "fetch" ? "text-phase-fetch" :
            currentPhase === "decode" ? "text-phase-decode" :
            currentPhase === "execute" ? "text-phase-execute" :
            currentPhase === "writeback" ? "text-phase-writeback" :
            "text-muted-foreground"
          )}>
            {currentPhase.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Memory Map Legend */}
      <div className="p-3 border border-border rounded-lg bg-muted/10">
        <h4 className="text-xs font-bold text-muted-foreground font-mono mb-2">Memory Legend</h4>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
            <span>Current PC Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-cpu-memory/20" />
            <span>Recently Accessed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-secondary/20" />
            <span>Modified</span>
          </div>
        </div>
      </div>
    </div>
  );
};