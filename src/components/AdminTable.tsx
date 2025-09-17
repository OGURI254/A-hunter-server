"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";


type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number";
};

interface AdminTableProps {
  title: string;
  fields: Field[];
  listQuery: any;
  createMutation: any;
  updateMutation?: any;
  deleteMutation?: any;
}

export default function AdminTable({
  title,
  fields,
  listQuery,
  createMutation,
  updateMutation,
  deleteMutation,
}: AdminTableProps) {
  const items = useQuery(listQuery);
  const createItem = useMutation(createMutation);
  const updateItem = useMutation(updateMutation || createMutation); // fallback
  const deleteItem = useMutation(deleteMutation || createMutation);

  const [form, setForm] = useState<Record<string, any>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createItem(form);
    setForm({});
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {/* Create Form */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        {fields.map((f) =>
          f.type === "textarea" ? (
            <textarea
              key={f.name}
              placeholder={f.label}
              className="border p-2 w-full"
              value={form[f.name] || ""}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            />
          ) : (
            <input
              key={f.name}
              type={f.type || "text"}
              placeholder={f.label}
              className="border p-2 w-full"
              value={form[f.name] || ""}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            />
          )
        )}
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Add {title.slice(0, -1)}
        </button>
      </form>

      {/* List */}
      <ul className="space-y-2">
        {items?.map((item: any) => (
          <li
            key={item._id}
            className="bg-white p-3 shadow rounded flex justify-between items-center"
          >
            <pre className="text-xs max-w-md overflow-auto">
              {JSON.stringify(item, null, 2)}
            </pre>
            <div className="flex gap-2">
              {updateMutation && (
                <button
                  onClick={() =>
                    updateItem({
                      id: item._id,
                      ...form,
                    })
                  }
                  className="text-blue-600"
                >
                  Edit
                </button>
              )}
              {deleteMutation && (
                <button
                  onClick={() => deleteItem({ id: item._id })}
                  className="text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
