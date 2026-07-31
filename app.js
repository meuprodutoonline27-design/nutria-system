// ⚠️ COLE A URL DO SEU CLOUDFLARE WORKER AQUI:
const WORKER_URL = 'https://wild-boat-c751geradordecardapio.meuprodutoonline27.workers.dev';

function calcularTmb(dados) {
    const peso = Number(dados.peso);
    const altura = Number(dados.altura);
    const idade = Number(dados.idade);

    if (!Number.isFinite(peso) || !Number.isFinite(altura) || !Number.isFinite(idade) || peso <= 0 || altura <= 0 || idade <= 0) {
        return null;
    }

    return Math.round((10 * peso) + (6.25 * altura) - (5 * idade) + 5);
}

let dietaAtualExportavel = null;

function definirDietaAtual(dieta) {
    dietaAtualExportavel = dieta;
    if (dieta) {
        localStorage.setItem('ultimaDieta', JSON.stringify(dieta));
    }
}

function gerarDietaLocal(dados) {
    const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const objetivo = dados.objetivo || 'Manutenção';
    const restricoesTexto = dados.restricoes || 'Nenhuma';
    const orcamento = Number(dados.orcamento) || 150;
    const tmb = calcularTmb(dados);

    const cardapio = dias.map((dia, index) => ({
        dia,
        cafe: index % 2 === 0 ? 'Pão integral com fruta e iogurte' : 'Vitamina de banana com aveia',
        almoco: index % 2 === 0 ? 'Arroz, feijão, frango grelhado e salada' : 'Torrada de pão integral com ovo e salada',
        lanche: 'Banana ou maçã com castanhas',
        jantar: index % 2 === 0 ? 'Tigela de legumes com proteína' : 'Omelete com salada'
    }));

    const lista_compras = {
        hortifruti: ['Banana', 'Maçã', 'Alface', 'Tomate', 'Cenoura', 'Batata', 'Cebola', 'Abobrinha'],
        mercearia: ['Arroz integral', 'Feijão', 'Aveia', 'Pão integral', 'Azeite de oliva'],
        proteinas: ['Frango', 'Ovos', 'Atum'],
        laticinios: restricoesTexto.includes('Sem Lactose') ? [] : ['Iogurte natural'],
        outros: orcamento > 200 ? ['Suco verde', 'Granola'] : ['Chá']
    };

    return {
        cardapio,
        lista_compras,
        tmb,
        mensagem: `Cardápio local gerado para ${objetivo.toLowerCase()} com TMB estimada de ${tmb ? `${tmb} kcal/dia` : '—'} e orçamento de R$ ${orcamento}.`
    };
}

// ========================================
// FUNÇÃO: Mostrar mensagens no banner
// ========================================
function mostrarStatus(mensagem, tipo = 'info') {
    const banner = document.getElementById('statusBanner');
    if (!banner) return;
    
    banner.textContent = mensagem;
    banner.className = 'rounded-xl border p-3 text-sm mb-4';
    
    if (tipo === 'sucesso') {
        banner.classList.add('border-green-200', 'bg-green-50', 'text-green-800');
    } else if (tipo === 'aviso') {
        banner.classList.add('border-yellow-200', 'bg-yellow-50', 'text-yellow-800');
    } else {
        banner.classList.add('border-blue-200', 'bg-blue-50', 'text-blue-800');
    }
    
    banner.classList.remove('hidden');
    
    setTimeout(() => banner.classList.add('hidden'), 3000);
}

// ========================================
// FUNÇÃO: Salvar formulário automaticamente
// ========================================
function aplicarTema() {
    const nome = document.getElementById('nomeProfissional')?.value?.trim() || 'NutriIA';
    const cor = document.getElementById('corTema')?.value || '#16a34a';
    const header = document.getElementById('appHeader');
    const title = document.getElementById('appTitleName');
    const toggle = document.getElementById('themeToggle');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const modoEscuro = localStorage.getItem('themeMode') === 'dark';

    document.body.classList.toggle('theme-dark', modoEscuro);
    document.body.classList.toggle('theme-light', !modoEscuro);

    if (header) {
        header.style.backgroundColor = cor;
    }

    if (metaTheme) {
        metaTheme.setAttribute('content', cor);
    }

    if (title) {
        title.textContent = nome;
    }

    if (toggle) {
        toggle.innerHTML = modoEscuro ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        toggle.setAttribute('aria-pressed', String(modoEscuro));
        toggle.title = modoEscuro ? 'Ativar modo claro' : 'Ativar modo escuro';
    }
}

function alternarTema() {
    const proximoModo = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    localStorage.setItem('themeMode', proximoModo);
    aplicarTema();
}

function salvarFormulario() {
    const dados = {
        nomeProfissional: document.getElementById('nomeProfissional').value,
        corTema: document.getElementById('corTema').value,
        peso: document.getElementById('peso').value,
        altura: document.getElementById('altura').value,
        idade: document.getElementById('idade').value,
        objetivo: document.getElementById('objetivo').value,
        orcamento: document.getElementById('orcamento').value,
        restricoes: Array.from(document.querySelectorAll('.restricao:checked')).map(cb => cb.value),
        tmb: calcularTmb({
            peso: document.getElementById('peso').value,
            altura: document.getElementById('altura').value,
            idade: document.getElementById('idade').value
        })
    };
    
    localStorage.setItem('dadosFormulario', JSON.stringify(dados));
    aplicarTema();
}

function atualizarResumoTmb() {
    const valor = calcularTmb({
        peso: document.getElementById('peso').value,
        altura: document.getElementById('altura').value,
        idade: document.getElementById('idade').value
    });

    const elemento = document.getElementById('tmbValue');
    if (elemento) {
        elemento.textContent = valor ? `${valor} kcal/dia` : '— kcal/dia';
    }
}

function salvarNoHistorico(dieta) {
    const historico = JSON.parse(localStorage.getItem('historicoCardapios') || '[]');
    const novoRegistro = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        dieta
    };

    historico.unshift(novoRegistro);
    localStorage.setItem('historicoCardapios', JSON.stringify(historico.slice(0, 10)));
}

function carregarHistorico() {
    const container = document.getElementById('historicoContainer');
    if (!container) return;

    const historico = JSON.parse(localStorage.getItem('historicoCardapios') || '[]');

    if (historico.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500">Nenhum cardápio salvo ainda.</p>';
        return;
    }

    container.innerHTML = historico.map(item => {
        const objetivo = item.dieta?.objetivo || 'Objetivo não informado';
        const orcamento = item.dieta?.orcamento || '—';
        return `
            <div class="border rounded-xl p-3 bg-gray-50">
                <div class="flex items-center justify-between mb-2 gap-2">
                    <strong class="text-sm text-green-700">${item.data}</strong>
                    <button data-id="${item.id}" class="text-xs text-green-700 font-semibold">Restaurar</button>
                </div>
                <p class="text-sm text-gray-600">${objetivo} • Orçamento: R$ ${orcamento}</p>
                <p class="text-sm text-gray-500">${item.dieta.cardapio?.length || 0} dias de cardápio</p>
            </div>
        `;
    }).join('');

    container.querySelectorAll('button[data-id]').forEach(botao => {
        botao.addEventListener('click', () => {
            const item = historico.find(h => h.id === Number(botao.getAttribute('data-id')));
            if (item) {
                renderizarCardapio(item.dieta.cardapio);
                renderizarListaCompras(item.dieta.lista_compras);
                document.getElementById('formSection').classList.add('hidden');
                document.getElementById('results').classList.remove('hidden');
                document.getElementById('historicoSection').classList.add('hidden');
                mostrarStatus('📚 Cardápio restaurado do histórico.', 'aviso');
            }
        });
    });
}

// ========================================
// FUNÇÃO: Carregar formulário salvo
// ========================================
function carregarFormulario() {
    const dadosSalvos = localStorage.getItem('dadosFormulario');
    
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        
        document.getElementById('nomeProfissional').value = dados.nomeProfissional || '';
        document.getElementById('corTema').value = dados.corTema || '#16a34a';
        document.getElementById('peso').value = dados.peso || '';
        document.getElementById('altura').value = dados.altura || '';
        document.getElementById('idade').value = dados.idade || '';
        document.getElementById('objetivo').value = dados.objetivo || 'Emagrecimento';
        document.getElementById('orcamento').value = dados.orcamento || '';
        
        if (dados.restricoes && dados.restricoes.length > 0) {
            dados.restricoes.forEach(restricao => {
                const checkbox = document.querySelector(`.restricao[value="${restricao}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }
}

// ========================================
// EVENTO: Salvar ao digitar
// ========================================
document.querySelectorAll('#dietForm input, #dietForm select').forEach(element => {
    element.addEventListener('change', () => {
        salvarFormulario();
        atualizarResumoTmb();
    });
    element.addEventListener('input', () => {
        salvarFormulario();
        atualizarResumoTmb();
    });
});

// ========================================
// EVENTO: Gerar cardápio
// ========================================
document.getElementById('dietForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const restricoes = Array.from(document.querySelectorAll('.restricao:checked')).map(cb => cb.value).join(', ');
    const dados = {
        peso: document.getElementById('peso').value,
        altura: document.getElementById('altura').value,
        idade: document.getElementById('idade').value,
        objetivo: document.getElementById('objetivo').value,
        restricoes: restricoes || 'Nenhuma',
        orcamento: document.getElementById('orcamento').value || 'Livre',
        tmb: calcularTmb({
            peso: document.getElementById('peso').value,
            altura: document.getElementById('altura').value,
            idade: document.getElementById('idade').value
        })
    };

    salvarFormulario();

    document.getElementById('formSection').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');

    let dieta;

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dados })
        });

        const responseText = await response.text();
        let result;

        try {
            result = JSON.parse(responseText);
        } catch {
            throw new Error('A resposta do worker não veio em JSON válido.');
        }

        if (!response.ok) {
            throw new Error(result.error || `Erro ${response.status} do worker.`);
        }

        const rawText = result.response || result.result || result.message || '';
        if (!rawText) {
            throw new Error('O worker não retornou o conteúdo esperado.');
        }

        const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```/g, '').trim();

        try {
            dieta = JSON.parse(cleanJson);
        } catch {
            throw new Error('A resposta da IA não estava em formato JSON válido.');
        }

        if (!dieta.cardapio || !dieta.lista_compras) {
            throw new Error('A resposta da IA não contém os dados do cardápio.');
        }

    } catch (error) {
        console.warn('Worker indisponível. Usando cardápio local.', error);
        dieta = gerarDietaLocal(dados);
    }

    dieta.tmb = dieta.tmb ?? dados.tmb ?? calcularTmb(dados);
    definirDietaAtual(dieta);
    salvarNoHistorico(dieta);

    renderizarMetaCalorica(dados);
    renderizarCardapio(dieta.cardapio);
    renderizarListaCompras(dieta.lista_compras);

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    
    if (dieta.mensagem) {
        const mensagemFinal = dieta.tmb
            ? `${dieta.mensagem} TMB estimada: ${dieta.tmb} kcal/dia.`
            : dieta.mensagem;
        mostrarStatus(mensagemFinal, 'aviso');
    } else {
        mostrarStatus('✅ Cardápio gerado com sucesso! Salvo no seu celular.', 'sucesso');
    }
});

function montarTextoWhatsApp() {
    const dieta = dietaAtualExportavel || JSON.parse(localStorage.getItem('ultimaDieta') || 'null');
    if (!dieta || !dieta.cardapio) {
        return null;
    }

    const linhas = [];
    linhas.push('🍽️ Cardápio semanal NutriIA');
    linhas.push(`📌 Objetivo: ${dieta.objetivo || 'Não informado'}`);
    linhas.push(`🔥 TMB estimada: ${dieta.tmb ? `${dieta.tmb} kcal/dia` : 'Não informada'}`);
    const meta = calcularMetaCalorica({
        peso: dieta.peso,
        altura: dieta.altura,
        idade: dieta.idade,
        objetivo: dieta.objetivo
    });
    if (meta) {
        linhas.push(`🎯 Meta estimada: ${meta} kcal/dia`);
    }
    linhas.push(`💸 Orçamento: R$ ${dieta.orcamento || 'Não informado'}`);
    linhas.push('');

    dieta.cardapio.forEach(dia => {
        linhas.push(`📅 ${dia.dia}`);
        linhas.push(`☕ Café: ${dia.cafe}`);
        linhas.push(`🍽️ Almoço: ${dia.almoco}`);
        linhas.push(`🍎 Lanche: ${dia.lanche}`);
        linhas.push(`🌙 Jantar: ${dia.jantar}`);
        linhas.push('');
    });

    linhas.push('🛒 Lista de compras');
    Object.entries(dieta.lista_compras || {}).forEach(([secao, itens]) => {
        if (Array.isArray(itens) && itens.length > 0) {
            linhas.push(`• ${secao}: ${itens.join(', ')}`);
        }
    });

    return linhas.join('\n');
}

function exportarWhatsApp() {
    const texto = montarTextoWhatsApp();
    if (!texto) {
        mostrarStatus('Nenhum cardápio disponível para compartilhar.', 'aviso');
        return;
    }

    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

function exportarPdf() {
    window.print();
}

// ========================================
// FUNÇÃO: Renderizar cardápio
// ========================================
function calcularMetaCalorica(dados) {
    const tmb = calcularTmb(dados);
    if (!tmb) return null;

    const objetivo = (dados.objetivo || 'Manutenção').toLowerCase();
    if (objetivo.includes('emagrec')) return Math.round(tmb * 0.85);
    if (objetivo.includes('massa') || objetivo.includes('ganho')) return Math.round(tmb * 1.15);
    return tmb;
}

function renderizarMetaCalorica(dados) {
    const container = document.getElementById('metaCalorica');
    if (!container) return;

    const meta = calcularMetaCalorica(dados);
    if (!meta) {
        container.innerHTML = '';
        return;
    }

    const objetivo = dados.objetivo || 'Manutenção';
    container.innerHTML = `
        <div class="flex items-center justify-between gap-2">
            <span class="font-semibold">Sua meta estimada</span>
            <strong>${meta} kcal/dia</strong>
        </div>
        <p class="text-xs text-green-700 mt-1">Baseado em sua TMB e objetivo: ${objetivo}.</p>
    `;
}

function renderizarCardapio(cardapio) {
    const container = document.getElementById('menuContainer');
    container.innerHTML = '';
    
    cardapio.forEach(dia => {
        const html = `
            <div class="border border-gray-200 rounded-xl p-3 bg-gray-50">
                <h4 class="font-bold text-green-700 mb-2">${dia.dia}</h4>
                <div class="text-sm space-y-1">
                    <p><span class="font-semibold text-gray-600">☕ Café:</span> ${dia.cafe}</p>
                    <p><span class="font-semibold text-gray-600">🍽️ Almoço:</span> ${dia.almoco}</p>
                    <p><span class="font-semibold text-gray-600">🍎 Lanche:</span> ${dia.lanche}</p>
                    <p><span class="font-semibold text-gray-600">🌙 Jantar:</span> ${dia.jantar}</p>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

// ========================================
// FUNÇÃO: Renderizar lista de compras
// ========================================
function salvarEstadoChecklist() {
    const marcados = Array.from(document.querySelectorAll('#shoppingContainer input[type="checkbox"]:checked')).map(cb => cb.getAttribute('data-item-key'));
    localStorage.setItem('checklistCompras', JSON.stringify(marcados));
}

function restaurarEstadoChecklist() {
    const marcados = JSON.parse(localStorage.getItem('checklistCompras') || '[]');
    document.querySelectorAll('#shoppingContainer input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = marcados.includes(checkbox.getAttribute('data-item-key'));
    });
}

function renderizarListaCompras(lista) {
    const container = document.getElementById('shoppingContainer');
    container.innerHTML = '';
    
    const secoes = {
        'hortifruti': '🥬 Hortifruti',
        'mercearia': '🥫 Mercearia',
        'proteinas': '🥩 Proteínas / Açougue',
        'laticinios': '🧀 Laticínios',
        'outros': '🧴 Outros'
    };

    for (const [chave, titulo] of Object.entries(secoes)) {
        if (lista[chave] && lista[chave].length > 0) {
            const itens = lista[chave].map(item => {
                const key = `${chave}-${item}`;
                return `<li class="flex items-center"><input type="checkbox" data-item-key="${key}" class="mr-2 accent-green-600"> ${item}</li>`;
            }).join('');
            container.innerHTML += `
                <div>
                    <h5 class="font-bold text-gray-700 text-sm mb-1 border-b border-gray-200 pb-1">${titulo}</h5>
                    <ul class="text-sm text-gray-600 space-y-1 ml-1">${itens}</ul>
                </div>
            `;
        }
    }

    document.querySelectorAll('#shoppingContainer input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', salvarEstadoChecklist);
    });

    restaurarEstadoChecklist();
}

// ========================================
// AO CARREGAR
// ========================================
window.addEventListener('load', () => {
    carregarFormulario();
    aplicarTema();
    atualizarResumoTmb();
    carregarHistorico();
    
    const dietaSalva = localStorage.getItem('ultimaDieta');
    if (dietaSalva) {
        const dieta = JSON.parse(dietaSalva);
        definirDietaAtual(dieta);
        document.getElementById('formSection').classList.add('hidden');
        renderizarCardapio(dieta.cardapio);
        renderizarListaCompras(dieta.lista_compras);
        document.getElementById('results').classList.remove('hidden');
        
        setTimeout(() => {
            mostrarStatus('📱 Mostrando último cardápio salvo (offline disponível)', 'aviso');
        }, 500);
    }
});

function alternarHistorico(abrir = true) {
    const historicoSection = document.getElementById('historicoSection');
    if (!historicoSection) return;

    historicoSection.classList.toggle('hidden', !abrir);
    if (abrir) {
        carregarHistorico();
    }
}

document.getElementById('btnHistorico')?.addEventListener('click', () => alternarHistorico(true));
document.getElementById('btnHistoricoResultados')?.addEventListener('click', () => alternarHistorico(true));
document.getElementById('btnFecharHistorico')?.addEventListener('click', () => alternarHistorico(false));
document.getElementById('btnWhatsApp')?.addEventListener('click', exportarWhatsApp);
document.getElementById('btnPdf')?.addEventListener('click', exportarPdf);