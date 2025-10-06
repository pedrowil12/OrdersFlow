import { useEffect, useState, ChangeEvent } from "react";
import { Button, Card, Input } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { TableHero } from "@/components/table";
import { ToastHero, ToastWrapper } from "@/components/toast";

interface Produto {
  id: number;
  name: string;
  price: number;
  active: boolean;
}

interface Cliente {
  id: number;
  name: string;
  active: boolean;
}

interface Pedido {
  id: number;
  customerId: number;
  productId: number;
  quantity: number;
  price: number;
  customerName?: string;
  active: boolean;
  productName?: string;
}

export default function PaginaPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalInfoAberto, setModalInfoAberto] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);
  const [formulario, setFormulario] = useState({ 
    customerId: "", 
    productId: "", 
    quantity: "", 
    price: "" 
  });
  const [toast, setToast] = useState<{ 
    title: string; 
    type: "success" | "error" | "info" 
  } | null>(null);

  // === BUSCAS ===
  const buscarProdutos = async () => {
    try {
      const resposta = await fetch("/api/Product");
      if (!resposta.ok) throw new Error("Erro ao buscar produtos");
      const dados: Produto[] = await resposta.json();
      setProdutos(dados.filter(p => p.active));
    } catch {
      setToast({ title: "Erro ao carregar produtos", type: "error" });
    }
  };

  const buscarClientes = async () => {
    try {
      const resposta = await fetch("/api/Customer");
      if (!resposta.ok) throw new Error("Erro ao buscar clientes");
      const dados: Cliente[] = await resposta.json();
      setClientes(dados);
    } catch {
      setToast({ title: "Erro ao carregar clientes", type: "error" });
    }
  };

  const buscarPedidos = async () => {
    try {
      const resposta = await fetch("/api/Order");
      if (!resposta.ok) throw new Error("Erro ao buscar pedidos");
      const dados: Pedido[] = await resposta.json();

      const enriquecidos = dados.map(p => ({
        ...p,
        customerName: clientes.find(c => c.id === p.customerId)?.name ?? "Cliente não encontrado",
        productName: produtos.find(prod => prod.id === p.productId)?.name ?? "Produto não encontrado",
      }));

      const pedidosAtivos = enriquecidos.filter(e => e.active);
      setPedidos(pedidosAtivos);

    } catch {
      setToast({ title: "Erro ao carregar pedidos", type: "error" });
    }
  };

  useEffect(() => {
    if (formulario.productId) {
      const produto = produtos.find(p => p.id === parseInt(formulario.productId));

      setFormulario(anterior => ({
        ...anterior,
        price: produto?.price?.toString() ?? ''
      }));
    }
  }, [formulario.productId, produtos]);

  useEffect(() => {
    buscarProdutos();
    buscarClientes();
  }, []);

  useEffect(() => {
    if (produtos.length && clientes.length) buscarPedidos();
  }, [produtos, clientes]);

  // === MODAIS ===
  const abrirModalAdicionar = () => {
    setPedidoEditando(null);
    setFormulario({ customerId: "", productId: "", quantity: "", price: "" });
    setModalAberto(true);
  };

  const abrirModalEditar = (pedido: Pedido) => {
    setPedidoEditando(pedido);
    setFormulario({
      customerId: pedido.customerId.toString(),
      productId: pedido.productId.toString(),
      quantity: pedido.quantity.toString(),
      price: pedido.price.toString()
    });
    setModalAberto(true);
  };

  const abrirModalInfo = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setModalInfoAberto(true);
  };

  // === SALVAR ===
  const salvarPedido = async () => {
    if (!formulario.customerId || !formulario.productId || !formulario.quantity || !formulario.price) {
      setToast({ title: "Preencha todos os campos", type: "error" });
      return;
    }

    const cargaUtil = {
      customerId: parseInt(formulario.customerId),
      productId: parseInt(formulario.productId),
      quantity: parseInt(formulario.quantity),
      product: { id: parseInt(formulario.productId) },
      customer: { id: parseInt(formulario.customerId) },
      price: parseFloat(formulario.price),
      active: true
    };

    try {
      const metodo = pedidoEditando ? "PUT" : "POST";
      const url = pedidoEditando
        ? `/api/Order/${pedidoEditando.id}`
        : `/api/Order`;

      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cargaUtil),
      });

      if (!resposta.ok) throw new Error("Erro ao salvar pedido");

      await resposta.json();

      setToast({
        title: pedidoEditando ? "Pedido atualizado com sucesso" : "Pedido criado com sucesso",
        type: "success",
      });
      setModalAberto(false);
      setPedidoEditando(null);
    } catch {
      setToast({ title: "Erro ao salvar pedido", type: "error" });
    } finally {
      buscarPedidos();
    }
  };

  // === DELETAR ===
  const deletarPedido = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este pedido?")) return;
    try {
      const resposta = await fetch(`/api/Order/${id}`, { method: "DELETE" });
      if (!resposta.ok) throw new Error();
      setPedidos(anterior => anterior.filter(p => p.id !== id));
      setToast({ title: "Pedido deletado com sucesso", type: "info" });
    } catch {
      setToast({ title: "Erro ao deletar pedido", type: "error" });
    } finally {
      buscarPedidos();
    }
  };

  const colunas = [
    { header: "ID", field: "id" as keyof Pedido },
    { header: "Cliente", field: "customerName" as keyof Pedido },
    { header: "Produto", field: "productName" as keyof Pedido },
    { header: "Quantidade", field: "quantity" as keyof Pedido },
    { header: "Preço", field: "price" as keyof Pedido },
    {
      header: "Ações",
      render: (linha: Pedido) => (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => abrirModalInfo(linha)}>
            Info
          </Button>
          <Button variant="ghost" onClick={() => abrirModalEditar(linha)}>
            Editar
          </Button>
          <Button variant="flat" color="danger" onClick={() => deletarPedido(linha.id)}>
            Deletar
          </Button>
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
          <h1 className={title()}>Gestão de Pedidos</h1>

          <Button onClick={abrirModalAdicionar}>Adicionar Pedido</Button>

          <TableHero columns={colunas} data={pedidos} />

          {/* Modal de Informações */}
          {modalInfoAberto && pedidoSelecionado && (
            <div className="fixed inset-0 flex justify-center items-center z-50">
              <div
                className="absolute inset-0 bg-gray-200/40 backdrop-blur-sm"
                onClick={() => setModalInfoAberto(false)}
              ></div>

              <Card className="relative p-6 w-full max-w-lg rounded-xl shadow-2xl border border-gray-300 bg-white z-10">
                <h2 className="text-2xl font-bold mb-6">Informações do Pedido</h2>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">ID do Pedido</p>
                      <p className="text-lg font-semibold">{pedidoSelecionado.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Status</p>
                      <p className="text-lg font-semibold text-green-600">Ativo</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">Cliente</p>
                    <p className="text-lg font-semibold">{pedidoSelecionado.customerName}</p>
                    <p className="text-sm text-gray-400">ID: {pedidoSelecionado.customerId}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">Produto</p>
                    <p className="text-lg font-semibold">{pedidoSelecionado.productName}</p>
                    <p className="text-sm text-gray-400">ID: {pedidoSelecionado.productId}</p>
                  </div>

                  <div className="border-t pt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Quantidade</p>
                      <p className="text-lg font-semibold">{pedidoSelecionado.quantity} un.</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 font-medium">Valor Total</p>
                    <p className="text-2xl font-bold text-blue-600">
                      R$ {pedidoSelecionado.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="flat" onClick={() => setModalInfoAberto(false)}>
                      Fechar
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Modal de Edição/Criação */}
          {modalAberto && (
            <div className="fixed inset-0 flex justify-center items-center z-50">
              <div
                className="absolute inset-0 bg-gray-200/40 backdrop-blur-sm"
                onClick={() => setModalAberto(false)}
              ></div>

              <Card className="relative p-6 w-full max-w-md rounded-xl shadow-2xl border border-gray-300 bg-white z-10">
                <h2 className="text-2xl font-bold mb-6">
                  {pedidoEditando ? "Editar Pedido" : "Novo Pedido"}
                </h2>

                <div className="flex flex-col gap-4">
                  <Autocomplete
                    label="Cliente"
                    placeholder="Selecione um cliente"
                    selectedKey={formulario.customerId}
                    onSelectionChange={chave => setFormulario({ ...formulario, customerId: chave?.toString() || "" })}
                    isRequired
                  >
                    {clientes.map(c => (
                      <AutocompleteItem key={c.id.toString()}>{c.name}</AutocompleteItem>
                    ))}
                  </Autocomplete>

                  <Autocomplete
                    label="Produto"
                    placeholder="Selecione um produto"
                    selectedKey={formulario.productId}
                    onSelectionChange={chave => setFormulario({ ...formulario, productId: chave?.toString() || "" })}
                    isRequired
                  >
                    {produtos.map(p => (
                      <AutocompleteItem key={p.id.toString()}>{p.name}</AutocompleteItem>
                    ))}
                  </Autocomplete>

                  <Input
                    type="number"
                    label="Quantidade"
                    value={formulario.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormulario({ ...formulario, quantity: e.target.value })
                    }
                    min="1"
                    isRequired
                  />
                  <Input
                    type="number"
                    label="Preço Total"
                    value={formulario.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormulario({ ...formulario, price: e.target.value })
                    }
                    isRequired
                  />

                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="flat" onClick={() => setModalAberto(false)}>
                      Cancelar
                    </Button>
                    <Button color="primary" onClick={salvarPedido}>
                      {pedidoEditando ? "Salvar" : "Criar"}
                    </Button>
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