import React, { useState } from "react";

interface CreateListModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const CreateListModal: React.FC<CreateListModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear nueva lista</h2>
        <input
          type="text"
          placeholder="Nombre de la lista"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600">Cancelar</button>
          <button
            onClick={() => {
              onCreate(name);
              setName("");
              onClose();
            }}
            className="bg-pink-500 text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};
