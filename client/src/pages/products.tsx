import { useEffect, useState } from "react";
import { Button, Card, Input } from "@heroui/react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { TableHero } from "@/components/table";
import { ToastHero, ToastWrapper } from "@/components/toast";

interface Product {
  id: number;
  name: string;
  price: number;
  active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", price: "" });
  const [toast, setToast] = useState<{ title: string; type: "success" | "error" | "info" } | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/Product");
      const data = await res.json();
      setProducts(data.filter((p: Product) => p.active !== false));
    } catch {
      setToast({ title: "Erro ao carregar produtos", type: "error" });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({ name: "", price: "" });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({ name: product.name, price: product.price.toString() });
    setModalOpen(true);
  };

  const saveProduct = async () => {
    if (!form.name || !form.price) {
      setToast({ title: "Preencha todos os campos", type: "error" });
      return;
    }

    try {
      if (editingProduct) {
        await fetch("/api/Product", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, name: form.name, price: parseFloat(form.price), active: true }),
        });
        setToast({ title: "Produto atualizado com sucesso", type: "success" });
      } else {
        await fetch("/api/Product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, price: parseFloat(form.price), active: true }),
        });
        setToast({ title: "Produto criado com sucesso", type: "success" });
      }

      setModalOpen(false);
      fetchProducts();
    } catch {
      setToast({ title: "Erro ao salvar produto", type: "error" });
    }
  };

  const deactivateProduct = async (id: number) => {
    try {
      await fetch(`/api/Product/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: false }),
      });
      setToast({ title: "Produto desativado", type: "info" });
      fetchProducts();
    } catch {
      setToast({ title: "Erro ao desativar produto", type: "error" });
    }
  };

  const columns = [
    { header: "ID", field: "id" as keyof Product },
    { header: "Nome", field: "name" as keyof Product },
    {
      header: "Preço",
      field: "price" as keyof Product,
      render: (row: Product) => `R$ ${row.price.toFixed(2)}`,
    },
    {
      header: "Ações",
      render: (row: Product) => (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => openEditModal(row)}>Editar</Button>
          <Button variant="flat" color="danger" onClick={() => deactivateProduct(row.id)}>Desativar</Button>
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
            <h1 className={title()}>Gestão de Produtos</h1>
          </div>

          <Button onClick={openAddModal}>Adicionar Produto</Button>

          <TableHero columns={columns} data={products} />

          {modalOpen && (
            <div className="fixed inset-0 flex justify-center items-center z-50">
              {/* Overlay suave */}
              <div className="absolute inset-0 bg-gray-200/40 backdrop-blur-sm"></div>

              {/* Modal */}
              <Card className="relative p-6 w-full max-w-md rounded-xl shadow-2xl border border-gray-300 bg-white z-10">
                <h2 className="text-2xl font-bold mb-6">{editingProduct ? "Editar Produto" : "Novo Produto"}</h2>
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Nome"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Preço"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="flat" onClick={() => setModalOpen(false)}>Cancelar</Button>
                    <Button onClick={saveProduct}>{editingProduct ? "Salvar" : "Criar"}</Button>
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
