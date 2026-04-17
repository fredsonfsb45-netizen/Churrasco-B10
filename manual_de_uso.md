# Manual de Instrução: Churrasco do B10

## 👋 Visão Geral
O sistema de Gestão **Churrasco do B10** foi construído para funcionar localmente no seu dispositivo, oferecendo métricas de estoque, acompanhamento rigoroso do fluxo de caixa e geração veloz de recibos e cobranças no **WhatsApp**.

Abaixo está o detalhamento de cada funcionalidade e o "motor" (a lógica) existente por trás dos painéis financeiros do aplicativo.

---

## 1. 🏠 Aba Início

É o painel de "Raio-X" da saúde imediata do negócio. 

> [!NOTE]
> Você verá um resumo dos produtos que esgotaram ou chegaram no "alerta de estoque mínimo". Fique de olho na tabela final desta página para não zerar as geladeiras antes da reposição!

### Entendendo os Cálculos da Tela Inicial:

- **Capital pendente a Receber:** É a soma total (R$) de todas as vendas que foram registradas com o status _A Prazo / Fiado_, diminuindo da conta aqueles que já foram pagos e recebidos. É o dinheiro que "tá na rua".
- **Caixa Atual (Real):** Reflete a exata nota de dinheiro e PIX que devem estar em sua gaveta ou conta do banco naquele instante.
  * **A Matemática:** `Soma(Aporte de Capital) + Soma(Vendas Pagas Iniciais e Fiados Recebidos) - Despesas Totais (Insumos + Produtos)`.
- **Despesas Totais:** Mostra absolutamente tudo que foi investido pelo Churrasco do B10 desde que o app começou.
  * **A Matemática:** `Soma(Gastos em Insumos) + Total(Quantidade x Custo) de produtos na geladeira + Total do Custo dos produtos que você já vendeu`.
- **Faturamento Total:** Mostra absolutamente tudo o que foi gerado de valor na frente o cliente (independente de ele ter pago à vista ou ainda estar devendo).
- **Lucro Real Limpo:** Trata-se do Fluxo Livre de Caixa de Retorno do Investimento Histórico do seu caixa.
  * **A Matemática:** `Faturamento Total - Despesas Totais`. 
  * _Sinal Amarelo:_ Se esse campo estiver negativo, significa que a soma de todo o estoque não-vendido que você bancou nas compras ainda pesa muito e a sua operação geral ainda está "no vermelho" em questão de pagar os fornecedores (Break-even).

---

## 2. 🛒 Aba Insumos

Responsável pelo cadastro de custos "indivísiveis" de revenda, ou seja, material de apoio. Exemplos: Sacos de carvão, sal grosso, isopor, frete, plásticos ou grandes fardos de carnes cruas.
Esses gastos vão alimentar diretamente as deduções nas suas **Despesas Totais** da Aba Inicial, garantindo que o seu "Lucro" nunca pareça maior do que de fato é.

---

## 3. 📦 Aba Produtos (Estoque)

Aba vital para a automação da loja. Todo produto que você pretende vender ou girar quantitativamente precisa ser inserido aqui.
- Ao cadastrar, você insere o **Custo de Compra (Unitário)**. O sistema entende imediatamente que o caixa gastou aquele dinheiro, afetando o *"Caixa Atual (Real)"*. 
- **⚠️ Alerta de Estoque Mínimo:** Define em qual quantidade restante o produto deve disparar um aviso de recarga ("Baixo") na página Inicial.

> [!WARNING]
> Se você apagar (🗑️) definitivamente um produto aqui, o sistema entenderá que as próximas compras "NÃO EXISTIRAM". O dinheiro investido nele é ignorado. Use para corrigir erros de digitação e crie um novo.

---

## 4. 💰 Aba Venda

A área de check-out principal. Ela tem inteligência de cruzar estoque x forma de pagamento em poucos toques.

### Funcionamento do "Recebido Fiado" (Inovação Tecnológica)
Você pode vender no menu selecionando "A Prazo / Fiado".
1. A venda aparecerá na área  📝 **Contas a Receber (Fiado)**.
2. Quando o cliente lhe pagar, você pressiona **✅ Receber** ao lado do nome dele.
3. Magia: O valor instantaneamente pula para o seu **Caixa Atual (Real)** e o status deste item muda de fato, sumindo da lista PENDENTE e caindo de uma vez na mesa abaixo: **✅ Fiados Recebidos (Histórico)**.

> [!TIP]
> A mesa de Histórico dos "Fiados Recebidos" guardará pra sempre os ex-caloteiros que efetuaram seus pagamentos (e suas datas/horários). Se um cliente pedir a conta, você pode apertar o botão `📄 Emitir Recibo` ao lado e jogar a confirmação do fiado quitado diretamente para o Whats App dele sem esforço.

---

## 5. 📊 Aba Análises

Dois gráficos poderosos:
1. **Gráfico de Barras (Volume Mínimo):** Mostra quem tem mais escoamento físico (Ex: Vendemos mais lata de coca ou lata de suco?).
2. **Gráfico de Pizza (Oportunidade e Lucratividade/Margem):** Mesmo vendendo MENOS carne que cerveja, pode ser que a carne represente a MAIOR fatiada do Pizza. Esse gráfico revela onde está a sua verdadeira galinha de ovos de ouro: *quem te dá o lucro pesado, e não o que vende mais e lucra pouco.*

---

## 6. ⚙️ Aba Ajustes

- **Aporte de Capital:** Para evitar que seu "Caixa Atual (Real)" fique engessado ou negativo caso você tire R$ 5.000,00 da sua conta poupança e compre o Estoque pela primeira vez. Digite esse valor e clique ali que ele equilibra sua equação do sistema garantindo exatidão no "dinheiro no bolso".
- **Backup & Exportação Excel (.xlsx):** O BD é local. Clique de vez em quando para baixar a carga bruta e enviar pra você num pendrive/e-mail para caso seu computador pife! Pode reinstalar livremente upando as planilhas aqui em "Restaurar Planilha".

> [!CAUTION]
> A "Zona de Perigo" de resetar e apagar os dados fará toda quantia, produtos, vendas e faturamentos virarem fumaça digital. Só acesse isso quando fechar a empresa, falhar gravemente num erro de estoque ou trocar de computador. Use com respeito.
