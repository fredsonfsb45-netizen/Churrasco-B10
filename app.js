// !!! COLOQUE SUAS CREDENCIAIS DO SUPABASE AQUI !!!
const SUPABASE_URL = "https://yvpeadvhisjiuyauprol.supabase.co";
const SUPABASE_KEY = "SUA_CHAVE_ANON_AQUI";

let supabase;

// Validação simples
if (SUPABASE_URL === "SUA_URL_AQUI") {
    document.getElementById('main-content').innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            <strong class="font-bold">ERRO DE CONFIGURAÇÃO!</strong>
            <span class="block sm:inline">Você precisa colocar sua URL e a Chave Anon do Supabase no arquivo <b>app.js</b>.</span>
        </div>`;
} else {
    // Inicializa o Cliente Oficial do Supabase
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Inicia no modo Garçom por Padrão
    setMode('garcom');
}

function showAlert(message, isError=false) {
    const container = document.getElementById('alert-container');
    const alertId = 'alert_' + Math.random().toString(36).substr(2, 9);
    const colorClass = isError ? 'bg-red-500' : 'bg-green-500';
    
    container.innerHTML += `
        <div id="${alertId}" class="${colorClass} text-white px-6 py-3 rounded shadow-lg mb-2 transition-opacity duration-500 opacity-100">
            ${message}
        </div>
    `;
    
    setTimeout(() => {
        const el = document.getElementById(alertId);
        if (el) {
            el.classList.remove('opacity-100');
            el.classList.add('opacity-0');
            setTimeout(() => el.remove(), 500);
        }
    }, 3000);
}

async function setMode(mode) {
    const content = document.getElementById('main-content');
    content.innerHTML = '<div class="text-center text-gray-500 mt-10">Carregando dados...</div>';
    
    try {
        if (mode === 'garcom') {
            await renderGarcom(content);
        } else if (mode === 'cozinha') {
            await renderCozinha(content);
        } else if (mode === 'dono') {
            await renderDono(content);
        }
    } catch (error) {
        console.error(error);
        showAlert("Erro de conexão com o Banco", true);
        content.innerHTML = '<div class="text-center text-red-500 mt-10">Erro ao carregar dados. Verifique a URL do Supabase.</div>';
    }
}

// ==========================================
// VISÃO DO GARÇOM
// ==========================================
async function renderGarcom(container) {
    // Busca produtos
    const { data: produtos } = await supabase.from('produtos').select('*').order('nome');
    // Busca comandas abertas
    const { data: comandas } = await supabase.from('comandas').select('*').eq('status', 'Aberta');
    
    let comandasOptions = "<option value=''>Selecione uma comanda...</option>";
    if (comandas) comandas.forEach(c => { comandasOptions += `<option value='${c.id}'>Mesa ${c.mesa_cliente}</option>` });
    
    let produtosOptions = "<option value=''>Selecione o produto...</option>";
    if (produtos) produtos.forEach(p => { produtosOptions += `<option value='${p.id}'>${p.nome} - R$ ${p.preco} (Estoque: ${p.estoque_atual})</option>` });

    container.innerHTML = `
        <h1 class="text-3xl font-bold mb-6">Módulo do Garçom 🍽️</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- ABRIR MESA -->
            <div class="bg-white p-6 rounded-lg shadow border-t-4 border-b10">
                <h2 class="text-xl font-bold mb-4">Abertura de Mesa</h2>
                <input type="text" id="g_mesa" placeholder="Nome do Cliente ou N° Mesa" class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500">
                <button onclick="abrirMesa()" class="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700">Abrir Nova Comanda</button>
            </div>
            
            <!-- LANÇAR PEDIDO -->
            <div class="bg-white p-6 rounded-lg shadow border-t-4 border-b10">
                <h2 class="text-xl font-bold mb-4">Lançar no Pedido</h2>
                <select id="g_comanda" class="w-full p-2 border rounded mb-4">${comandasOptions}</select>
                <select id="g_produto" class="w-full p-2 border rounded mb-4">${produtosOptions}</select>
                <input type="number" id="g_qtd" value="1" min="1" class="w-full p-2 border rounded mb-4">
                <button onclick="lancarPedido()" class="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">Enviar para Cozinha</button>
            </div>
        </div>
        
        <!-- PAGAR MESA -->
        <div class="mt-8 bg-white p-6 rounded-lg shadow border-t-4 border-b10">
            <h2 class="text-xl font-bold mb-4">Fechar Conta Paga</h2>
            <div class="flex gap-4 mb-4">
                <select id="f_comanda" onchange="verConta()" class="flex-1 p-2 border rounded">${comandasOptions}</select>
                <button onclick="fecharMesa()" class="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">MARCAR COMO PAGO</button>
            </div>
            <div id="conta_detalhes" class="bg-gray-50 border rounded p-4 h-32 overflow-auto text-sm text-gray-600">
                Selecione uma mesa para ver os itens da conta...
            </div>
        </div>
    `;
}

window.abrirMesa = async () => {
    const mesa = document.getElementById('g_mesa').value;
    if (!mesa) return showAlert("Preencha o campo de mesa", true);
    
    document.getElementById('g_mesa').disabled = true;
    const { error } = await supabase.from('comandas').insert({ mesa_cliente: mesa });
    if (!error) {
        showAlert("Mesa aberta com sucesso!");
        setMode('garcom');
    }
}

window.lancarPedido = async () => {
    const cid = document.getElementById('g_comanda').value;
    const pid = document.getElementById('g_produto').value;
    const qtd = parseInt(document.getElementById('g_qtd').value);
    
    if (!cid || !pid) return showAlert("Selecione a comanda e o produto", true);
    
    // Busca do produto para conferir estoque
    const { data: p } = await supabase.from('produtos').select('estoque_atual').eq('id', pid).single();
    if (p.estoque_atual < qtd) return showAlert("Estoque insuficiente!", true);
    
    // Update estoque & insert item pedido
    await supabase.from('produtos').update({ estoque_atual: p.estoque_atual - qtd }).eq('id', pid);
    const { error } = await supabase.from('itens_pedido').insert({ comanda_id: cid, produto_id: pid, quantidade: qtd });
    
    if (!error) {
        showAlert("Lançado e enviado à Cozinha!");
        setMode('garcom');
    }
}

window.verConta = async () => {
    const cid = document.getElementById('f_comanda').value;
    if (!cid) return document.getElementById('conta_detalhes').innerHTML = '';
    
    const { data } = await supabase.from('itens_pedido').select('quantidade, status_producao, produtos(nome, preco)').eq('comanda_id', cid);
    if (!data || data.length === 0) return document.getElementById('conta_detalhes').innerHTML = 'Nenhum item consumido ainda.';
    
    let html = '<table class="w-full text-left"><tr><th>Qtd</th><th>Produto</th><th>R$ Unit.</th><th>Total</th></tr>';
    let total = 0;
    data.forEach(i => {
        let val = i.quantidade * i.produtos.preco;
        total += val;
        html += `<tr><td>${i.quantidade}x</td><td>${i.produtos.nome}</td><td>R$ ${i.produtos.preco.toFixed(2)}</td><td class="font-bold">R$ ${val.toFixed(2)}</td></tr>`;
    });
    html += `</table><div class="mt-4 text-right text-lg font-bold text-red-600">TOTAL A RECEBER: R$ ${total.toFixed(2)}</div>`;
    document.getElementById('conta_detalhes').innerHTML = html;
}

window.fecharMesa = async () => {
    const cid = document.getElementById('f_comanda').value;
    if (!cid) return;
    
    if (confirm("Recebeu o dinheiro do cliente?")) {
        await supabase.from('comandas').update({ status: 'Fechada' }).eq('id', cid);
        showAlert("Mesa fechada e dinheiro no caixa!");
        setMode('garcom');
    }
}

// ==========================================
// VISÃO DA COZINHA
// ==========================================
async function renderCozinha(container) {
    const { data: pendentes } = await supabase.from('itens_pedido').select('id, quantidade, produtos(nome), comandas!inner(mesa_cliente, status)').eq('status_producao', 'Recebido');
    
    // Filtramos apenas itens de mesas abertas, igual na API Pyhton
    const ativos = pendentes ? pendentes.filter(p => p.comandas.status === 'Aberta') : [];
    
    let cards = ativos.length ? '' : '<div class="col-span-full text-center text-gray-500">Tudo limpo! Nenhum pedido pendente.</div>';
    
    ativos.forEach(p => {
        cards += `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow flex justify-between items-center">
                <div>
                    <div class="text-xs text-gray-500 font-bold uppercase mb-1">Mesa/Cliente</div>
                    <div class="text-xl font-bold">${p.comandas.mesa_cliente}</div>
                    <div class="text-lg mt-2">${p.quantidade}x ${p.produtos.nome}</div>
                </div>
                <button onclick="marcarPronto(${p.id})" class="bg-yellow-500 text-white font-bold h-full px-6 py-2 rounded hover:bg-yellow-600 shadow transition-colors">
                    PRONTO
                </button>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">Monitor Cozinha 🔥</h1>
            <button onclick="setMode('cozinha')" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">↻ Atualizar</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${cards}
        </div>
    `;
}

window.marcarPronto = async (itemId) => {
    await supabase.from('itens_pedido').update({ status_producao: 'Pronto' }).eq('id', itemId);
    showAlert("Marcado como Pronto!");
    setMode('cozinha');
}

// ==========================================
// VISÃO DO DONO
// ==========================================
async function renderDono(container) {
    // Buscas em paralelo para ser rápido
    const [ {data: produtos}, {data: pagos}, {data: desp} ] = await Promise.all([
        supabase.from('produtos').select('*').order('nome'),
        supabase.from('itens_pedido').select('quantidade, produtos(preco), comandas!inner(status)').eq('comandas.status', 'Fechada'),
        supabase.from('despesas').select('valor')
    ]);
    
    // Alerta de Estoque
    let alertas = '';
    produtos.forEach(p => {
        if (p.estoque_atual <= p.estoque_minimo) {
            alertas += `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2 font-bold">⚠️ ${p.nome} está acabando! Faltam apenas ${p.estoque_atual}.</div>`;
        }
    });
    if (!alertas) alertas = '<div class="text-green-600 font-bold">Todos os estoques sob controle.</div>';
    
    // DRE Financeiro
    let totalReceitas = 0;
    if (pagos) {
        pagos.forEach(p => { totalReceitas += p.quantidade * p.produtos.preco; });
    }
    
    let totalDespesas = 0;
    if (desp) {
        desp.forEach(d => { totalDespesas += d.valor; });
    }
    
    let lucro = totalReceitas - totalDespesas;
    let corLucro = lucro >= 0 ? 'text-green-600' : 'text-red-600';

    container.innerHTML = `
        <h1 class="text-3xl font-bold mb-6">Painel Administrativo 📈</h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <!-- FINANCEIRO -->
            <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-bold mb-4">Fluxo de Caixa (Balancete)</h2>
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div class="bg-gray-50 border rounded p-4">
                        <div class="text-xs text-gray-500 uppercase font-bold">Vendido Diário</div>
                        <div class="text-2xl font-bold text-gray-800">R$ ${totalReceitas.toFixed(2)}</div>
                    </div>
                    <div class="bg-gray-50 border rounded p-4">
                        <div class="text-xs text-gray-500 uppercase font-bold">Insumos Pagos</div>
                        <div class="text-2xl font-bold text-gray-800">R$ ${totalDespesas.toFixed(2)}</div>
                    </div>
                    <div class="bg-gray-50 border rounded p-4">
                        <div class="text-xs text-gray-500 uppercase font-bold">Líquido Final</div>
                        <div class="text-2xl font-bold ${corLucro}">R$ ${lucro.toFixed(2)}</div>
                    </div>
                </div>
                
                <h3 class="text-lg font-bold mt-6 mb-2">Lançar Compra / Despesa</h3>
                <div class="flex gap-4">
                    <input type="text" id="d_desc" placeholder="Ex: Carvão" class="flex-1 p-2 border rounded">
                    <input type="number" id="d_val" placeholder="R$ 0.00" class="w-32 p-2 border rounded">
                    <button onclick="lancarDespesa()" class="bg-gray-800 text-white font-bold py-2 px-6 rounded hover:bg-black">Registrar Saída</button>
                </div>
            </div>
            
            <!-- ALERTAS -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-bold mb-4">Radar da Despensa</h2>
                ${alertas}
            </div>
        </div>
        
        <!-- CARDÁPIO -->
        <div class="bg-white rounded-lg shadow p-6 border-t-4 border-b10">
            <h2 class="text-xl font-bold mb-4">Gestão do Cardápio</h2>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <input type="text" id="p_nome" placeholder="Nome" class="md:col-span-2 p-2 border rounded">
                <input type="number" id="p_preco" placeholder="Preço (R$)" step="0.01" class="p-2 border rounded">
                <input type="number" id="p_estoque" placeholder="Qtd. Hoje" class="p-2 border rounded">
                <button onclick="cadastrarProduto()" class="bg-red-600 text-white font-bold p-2 mb-2 rounded hover:bg-red-700">Salvar Item</button>
            </div>
            
            <table class="w-full text-left text-sm mt-4 border-t pt-4">
                <tr class="text-gray-500 uppercase border-b"><th class="pb-2">ID</th><th>Produto</th><th>Valor</th><th>Estoque</th></tr>
                ${produtos.map(p => `<tr class="border-b hover:bg-gray-50"><td class="py-2">#${p.id}</td><td>${p.nome}</td><td>R$ ${p.preco.toFixed(2)}</td><td class="font-bold">${p.estoque_atual}</td></tr>`).join('')}
            </table>
        </div>
    `;
}

window.lancarDespesa = async () => {
    const desc = document.getElementById('d_desc').value;
    const val = parseFloat(document.getElementById('d_val').value);
    if (!desc || isNaN(val) || val <= 0) return showAlert("Preencha corretamente", true);
    
    await supabase.from('despesas').insert({ descricao: desc, valor: val });
    showAlert("Despesa registrada e computada nio DRE.");
    setMode('dono');
}

window.cadastrarProduto = async () => {
    const nome = document.getElementById('p_nome').value;
    const preco = parseFloat(document.getElementById('p_preco').value);
    const est = parseInt(document.getElementById('p_estoque').value);
    
    if (!nome || isNaN(preco)) return showAlert("Campo Obrigatório: Nome e Preço", true);
    
    await supabase.from('produtos').insert({ nome: nome, preco: preco, estoque_atual: isNaN(est)? 0 : est });
    showAlert("Item adicionado ao cardápio!");
    setMode('dono');
}
