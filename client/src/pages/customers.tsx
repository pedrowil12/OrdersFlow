"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@heroui/react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { TableHero } from "@/components/table";
import { ToastHero, ToastWrapper } from "@/components/toast";

interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
  active: boolean;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [toast, setToast] = useState<{ title: string; type: "success" | "error" | "info" } | null>(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/Customer");
      const data = await res.json();
      setCustomers(data.filter((c: Customer) => c.active !== false));
    } catch {
      setToast({ title: "Erro ao carregar clientes", type: "error" });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openAddModal = () => {
    setEditingCustomer(null);
    setForm({ name: "", address: "", phone: "" });
    setModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm({ name: customer.name, address: customer.address, phone: customer.phone });
    setModalOpen(true);
  };

  const saveCustomer = async () => {
    if (!form.name || !form.address || !form.phone) {
      setToast({ title: "Preencha todos os campos", type: "error" });
      return;
    }

    try {
      if (editingCustomer) {
        await fetch("/api/Customer", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCustomer.id, name: form.name, address: form.address, phone: form.phone, active: true }),
        });
        setToast({ title: "Cliente atualizado com sucesso", type: "success" });
      } else {
        await fetch("/api/Customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, address: form.address, phone: form.phone, active: true }),
        });
        setToast({ title: "Cliente criado com sucesso", type: "success" });
      }

      setModalOpen(false);
      fetchCustomers();
    } catch {
      setToast({ title: "Erro ao salvar cliente", type: "error" });
    }
  };

  const deactivateCustomer = async (id: number) => {
    try {
      await fetch(`/api/Customer/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: false }),
      });
      setToast({ title: "Cliente deletado", type: "info" });
      fetchCustomers();
    } catch {
      setToast({ title: "Erro ao deletar cliente", type: "error" });
    }
  };

  const columns = [
    { header: "ID", field: "id" as keyof Customer },
    { header: "Nome", field: "name" as keyof Customer },
    { header: "Endereço", field: "address" as keyof Customer },
    { header: "Telefone", field: "phone" as keyof Customer },
    {
      header: "Ações",
      render: (row: Customer) => (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => openEditModal(row)}>Editar</Button>
          <Button variant="flat" color="danger" onClick={() => deactivateCustomer(row.id)}>Deletar</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ToastWrapper />
      {toast && <ToastHero title={toast.title} type={toast.type} />}
      <DefaultLayout>
        <section className="flex flex-col items-center gap-6 py-8 md:py-10 w-full">
          <div className="inline-block max-w-lg text-center">
            <h1 className={title()}>Gestão de Clientes</h1>
          </div>

          <Button onClick={openAddModal}>Adicionar Cliente</Button>

          <TableHero columns={columns} data={customers} />

          {modalOpen && (
            <div className="fixed inset-0 flex justify-center items-center z-50">
              {/* Overlay suave */}
              <div className="absolute inset-0 bg-gray-200/40 backdrop-blur-sm"></div>

              {/* Modal */}
              <Card className="relative p-6 w-full max-w-md rounded-xl shadow-2xl border border-gray-300 bg-white z-10">
                <h2 className="text-2xl font-bold mb-6">{editingCustomer ? "Editar Cliente" : "Novo Cliente"}</h2>
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Nome"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    placeholder="Endereço"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                  <Input
                    placeholder="Telefone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="flat" onClick={() => setModalOpen(false)}>Cancelar</Button>
                    <Button onClick={saveCustomer}>{editingCustomer ? "Salvar" : "Criar"}</Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </section>
      </DefaultLayout>
    </>
  );
}
