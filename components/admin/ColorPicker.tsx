import { useState, useRef } from "react";
import { useClickAway, useDebounce } from "react-use";
import { HexColorInput, HexColorPicker } from "react-colorful";

interface Props {
  value?: string;
  onPickerChange: (color: string) => void;
}

const ColorPicker = ({ value, onPickerChange }: Props) => {
  const popoverRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(value || "#000000");

  useDebounce(() => onPickerChange(color), 500, [color]);
  useClickAway(popoverRef, () => setIsOpen(false));

  return (
    <div className="relative">
      <div className="color-picker">
        <div
          className="size-5 cursor-pointer rounded-sm"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen((prev) => !prev)}
        />

        <div className="flex flex-row items-center">
          <p>#</p>
          <HexColorInput
            color={color}
            onChange={setColor}
            className="hex-input"
          />
        </div>
      </div>

      {isOpen && (
        <div className="hex-color-picker" ref={popoverRef}>
          <HexColorPicker color={color} onChange={setColor} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
