import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-2xl text-center justify-center">
          <span className={title()}>Sistema de&nbsp;</span>
          <span className={title({ color: "violet" })}>Gestão de Pedidos&nbsp;</span>
          <br />
          <span className={title()}>
            Crie, acompanhe e processe pedidos de forma simples e rápida.
          </span>

          <div className={subtitle({ class: "mt-4" })}>
            Sempre que um pedido é criado, ele é enviado para a fila de
            processamento. Um worker consome a mensagem e atualiza o status do
            pedido automaticamente.
          </div>
        </div>

      </section>
    </DefaultLayout>
  );
}
