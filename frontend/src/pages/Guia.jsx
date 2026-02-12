import { useState } from 'react'
import {
  BookOpen, TrendingUp, Wallet, PieChart, ShieldCheck, Target,
  DollarSign, BarChart3, CreditCard, LayoutDashboard, ChevronDown, ChevronUp,
  Lightbulb, AlertTriangle, ArrowRight, ClipboardList
} from 'lucide-react'

const TIPOS_INVESTIMENTO = [
  { tipo: 'CDB', descricao: 'Certificado de Deposito Bancario. Voce empresta dinheiro para o banco e recebe juros.', risco: 'Baixo', para: 'Iniciantes, quem quer seguranca', cor: 'blue' },
  { tipo: 'Tesouro Direto', descricao: 'Titulos publicos do governo federal. Considerado o investimento mais seguro do Brasil.', risco: 'Baixo', para: 'Todos os perfis, reserva de emergencia', cor: 'green' },
  { tipo: 'Poupanca', descricao: 'A caderneta tradicional. Rende pouco, mas e simples e sem imposto de renda.', risco: 'Muito Baixo', para: 'Quem esta comecando', cor: 'emerald' },
  { tipo: 'FIIs', descricao: 'Fundos Imobiliarios. Voce compra cotas de fundos que investem em imoveis e recebe alugueis mensais.', risco: 'Medio', para: 'Quem quer renda passiva mensal', cor: 'yellow' },
  { tipo: 'Acoes', descricao: 'Partes de empresas na bolsa de valores. O valor oscila conforme o mercado.', risco: 'Alto', para: 'Quem aceita volatilidade', cor: 'orange' },
  { tipo: 'Cripto', descricao: 'Criptomoedas como Bitcoin, Ethereum, etc. Mercado muito volatil.', risco: 'Muito Alto', para: 'Quem entende o mercado e aceita riscos elevados', cor: 'red' },
  { tipo: 'Outros', descricao: 'Fundos multimercado, debentures, COE e qualquer outro tipo nao listado.', risco: 'Variado', para: 'Depende do ativo especifico', cor: 'gray' },
]

const CORES_RISCO = {
  'Muito Baixo': 'bg-emerald-500/15 text-emerald-400',
  'Baixo': 'bg-green-500/15 text-green-400',
  'Medio': 'bg-yellow-500/15 text-yellow-400',
  'Alto': 'bg-orange-500/15 text-orange-400',
  'Muito Alto': 'bg-red-500/15 text-red-400',
  'Variado': 'bg-gray-500/15 text-gray-400',
}

function SecaoColapsavel({ titulo, icone: Icone, children, abertaPadrao = false }) {
  const [aberta, setAberta] = useState(abertaPadrao)

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setAberta(!aberta)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <Icone size={18} className="text-blue-400" />
          </div>
          <h3 className="text-white font-semibold text-base">{titulo}</h3>
        </div>
        {aberta ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {aberta && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  )
}

function CardConceito({ titulo, children }) {
  return (
    <div className="bg-gray-700/40 rounded-lg p-4">
      <h4 className="text-white font-semibold text-sm mb-2">{titulo}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
    </div>
  )
}

function CardPagina({ icone: Icone, titulo, descricao }) {
  return (
    <div className="bg-gray-700/40 rounded-lg p-4 flex gap-3">
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icone size={20} className="text-blue-400" />
      </div>
      <div>
        <h4 className="text-white font-semibold text-sm mb-1">{titulo}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{descricao}</p>
      </div>
    </div>
  )
}

function Guia() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={26} className="text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Guia do CashWise</h2>
      </div>

      <p className="text-gray-400 mb-6 leading-relaxed">
        Bem-vindo ao guia do CashWise! Aqui voce encontra explicacoes sobre cada area do sistema
        e um conteudo educativo completo sobre investimentos para ajudar voce a tomar melhores decisoes financeiras.
      </p>

      <div className="space-y-4">

        {/* Visao Geral das Paginas */}
        <SecaoColapsavel titulo="Paginas do Sistema" icone={LayoutDashboard} abertaPadrao={true}>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            O CashWise e dividido em 5 areas principais, cada uma com uma funcao clara para
            te ajudar a organizar suas financas:
          </p>
          <div className="grid gap-3">
            <CardPagina icone={LayoutDashboard} titulo="Dashboard"
              descricao="Visao geral do mes com 5 indicadores-chave (Total Recebido, Total Gasto, Saldo, % Gastos, % Investido), graficos de gastos por categoria e alertas de despesas pendentes." />
            <CardPagina icone={DollarSign} titulo="Receitas"
              descricao="Gerencie todas as suas fontes de renda. Cadastre receitas fixas (salario) e variaveis (freelance, dividendos), com filtro por mes e totalizador automatico." />
            <CardPagina icone={CreditCard} titulo="Despesas"
              descricao="Controle todos os seus gastos com categorias (Moradia, Alimentacao, Transporte...), tipo (Fixa/Variavel), forma de pagamento e status (Pago/Pendente)." />
            <CardPagina icone={TrendingUp} titulo="Investimentos"
              descricao="Gestao completa da sua carteira. Cadastre investimentos, acompanhe rentabilidade, veja o patrimonio total e analise a diversificacao pelo grafico de alocacao." />
            <CardPagina icone={Target} titulo="Planejamento"
              descricao="Regra 50/30/20 com barras de progresso, simulador de quanto voce pode investir e metas financeiras com estimativa de prazo para atingir cada objetivo." />
          </div>
        </SecaoColapsavel>

        {/* O que e investir */}
        <SecaoColapsavel titulo="O que sao Investimentos?" icone={Lightbulb}>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              Investir e colocar o seu dinheiro para trabalhar por voce. Em vez de deixar o dinheiro
              parado na conta (onde ele perde valor por causa da inflacao), voce aplica em algum ativo
              financeiro que gera <span className="text-white font-medium">rendimento</span> ao longo do tempo.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Exemplo: se voce tem R$ 1.000 parados, em um ano eles vao comprar menos coisas
              por causa da inflacao. Mas se voce investir esses R$ 1.000 em um CDB que rende 12% ao ano,
              ao final de 12 meses voce tera <span className="text-green-400 font-medium">R$ 1.120,00</span>. Seu dinheiro cresceu.
            </p>

            <h4 className="text-white font-semibold text-sm pt-2">Por que investir?</h4>
            <div className="grid gap-2">
              {[
                { titulo: 'Proteger o poder de compra', texto: 'A inflacao corroi o valor do dinheiro. Investir protege voce disso.' },
                { titulo: 'Fazer o dinheiro crescer', texto: 'Com juros compostos, pequenos valores regulares se tornam grandes quantias ao longo dos anos.' },
                { titulo: 'Alcancar objetivos', texto: 'Viagem, carro, casa propria, aposentadoria — investir transforma sonhos em metas alcancaveis.' },
                { titulo: 'Liberdade financeira', texto: 'Chegar ao ponto onde seus investimentos geram renda suficiente para cobrir suas despesas.' },
              ].map(item => (
                <div key={item.titulo} className="flex gap-2 items-start">
                  <ArrowRight size={14} className="text-blue-400 mt-1 shrink-0" />
                  <p className="text-gray-400 text-sm"><span className="text-white font-medium">{item.titulo}</span> — {item.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </SecaoColapsavel>

        {/* Conceitos fundamentais */}
        <SecaoColapsavel titulo="Conceitos Fundamentais" icone={BookOpen}>
          <div className="grid gap-3">
            <CardConceito titulo="Aporte">
              E o valor que voce coloca (investe) em um ativo. Pode ser unico (ex: R$ 5.000 de uma vez)
              ou recorrente (ex: R$ 500 todo mes). No CashWise, cada investimento tem um
              "Valor Investido" que representa o aporte feito.
            </CardConceito>

            <div className="bg-gray-700/40 rounded-lg p-4">
              <h4 className="text-white font-semibold text-sm mb-2">Rendimento / Rentabilidade</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                E o ganho que o investimento gera sobre o valor aplicado, expresso em percentual.
                Se voce investiu R$ 1.000 e agora tem R$ 1.100, sua rentabilidade foi de 10%.
              </p>

              <p className="text-white font-medium text-sm mb-2">No CashWise existem dois campos de rentabilidade:</p>

              <div className="grid gap-3 mb-3">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <h5 className="text-blue-400 font-semibold text-sm mb-1">Rent. Estimada (%)</h5>
                  <p className="text-gray-400 text-sm leading-relaxed mb-2">
                    E a <span className="text-white font-medium">promessa ou projecao</span> de rendimento do investimento.
                    Esse valor voce preenche no momento que cadastra, com base no que o banco ou corretora
                    informa que o ativo vai render.
                  </p>
                  <div className="bg-gray-800/80 rounded p-2.5 text-sm space-y-1">
                    <p className="text-gray-500">Exemplos:</p>
                    <p className="text-gray-400">CDB do Banco Inter promete 120% do CDI ≈ <span className="text-blue-400 font-medium">13% ao ano</span></p>
                    <p className="text-gray-400">Tesouro Selic rende aproximadamente <span className="text-blue-400 font-medium">12.75% ao ano</span></p>
                    <p className="text-gray-400">Poupanca rende cerca de <span className="text-blue-400 font-medium">7% ao ano</span></p>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Esse campo serve como referencia — e o que voce ESPERA ganhar.
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <h5 className="text-green-400 font-semibold text-sm mb-1">Rent. Real (%)</h5>
                  <p className="text-gray-400 text-sm leading-relaxed mb-2">
                    E o <span className="text-white font-medium">rendimento que de fato aconteceu</span> ate o momento.
                    Esse valor voce atualiza periodicamente conforme acompanha seu investimento no banco ou corretora.
                    Quando voce cadastra um investimento novo, a Rent. Real comeca em <span className="text-white font-medium">0%</span> porque ele acabou de ser feito.
                  </p>
                  <div className="bg-gray-800/80 rounded p-2.5 text-sm space-y-1">
                    <p className="text-gray-500">Exemplos:</p>
                    <p className="text-gray-400">Voce cadastrou um CDB com Estimada de 13%, e 6 meses depois ja rendeu <span className="text-green-400 font-medium">6.2%</span></p>
                    <p className="text-gray-400">Comprou acoes esperando 20%, mas caiu. Rent. Real: <span className="text-red-400 font-medium">-8%</span></p>
                    <p className="text-gray-400">Cripto que esperava 50% e disparou: Rent. Real: <span className="text-green-400 font-medium">72%</span></p>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Esse campo e o que o sistema usa para calcular o Valor Atual e o Lucro/Prejuizo.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/80 rounded-lg p-3">
                <p className="text-white font-medium text-sm mb-2">Exemplo pratico completo:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-gray-400 font-medium py-1.5 px-2 text-left">Campo</th>
                        <th className="text-gray-400 font-medium py-1.5 px-2 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700/50">
                        <td className="py-1.5 px-2 text-gray-400">Valor Investido</td>
                        <td className="py-1.5 px-2 text-white text-right">R$ 5.000,00</td>
                      </tr>
                      <tr className="border-b border-gray-700/50">
                        <td className="py-1.5 px-2 text-gray-400">Rent. Estimada</td>
                        <td className="py-1.5 px-2 text-blue-400 text-right">13% (promessa do banco)</td>
                      </tr>
                      <tr className="border-b border-gray-700/50">
                        <td className="py-1.5 px-2 text-gray-400">Rent. Real (6 meses depois)</td>
                        <td className="py-1.5 px-2 text-green-400 text-right">6.2% (rendeu ate agora)</td>
                      </tr>
                      <tr className="border-b border-gray-700/50">
                        <td className="py-1.5 px-2 text-gray-400">Valor Atual (calculado)</td>
                        <td className="py-1.5 px-2 text-white text-right font-medium">R$ 5.310,00</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2 text-gray-400">Lucro (calculado)</td>
                        <td className="py-1.5 px-2 text-green-400 text-right font-medium">+R$ 310,00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Formula: Valor Atual = 5.000 x (1 + 6.2 / 100) = 5.000 x 1.062 = R$ 5.310,00
                </p>
              </div>
            </div>

            <CardConceito titulo="Juros Compostos">
              Sao os "juros sobre juros" — o principal motor de crescimento de investimentos
              de longo prazo. No primeiro mes, R$ 1.000 a 1% rendem R$ 10. No segundo mes,
              voce ganha sobre R$ 1.010, e assim por diante. Em 10 anos, R$ 1.000 a 1% ao mes
              viram R$ 3.300. Em 20 anos, R$ 10.890. Esse e o poder dos juros compostos.
            </CardConceito>

            {/* Tabela de juros compostos */}
            <div className="bg-gray-700/40 rounded-lg p-4">
              <h4 className="text-white font-semibold text-sm mb-3">Exemplo: R$ 1.000 a 1% ao mes</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-gray-400 font-medium py-2 px-2 text-left">Mes</th>
                      <th className="text-gray-400 font-medium py-2 px-2 text-right">Valor Inicial</th>
                      <th className="text-gray-400 font-medium py-2 px-2 text-right">Rendimento</th>
                      <th className="text-gray-400 font-medium py-2 px-2 text-right">Valor Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { mes: 1, inicial: 1000, rend: 10, final: 1010 },
                      { mes: 2, inicial: 1010, rend: 10.10, final: 1020.10 },
                      { mes: 3, inicial: 1020.10, rend: 10.20, final: 1030.30 },
                      { mes: 6, inicial: 1051.01, rend: 10.51, final: 1061.52 },
                      { mes: 12, inicial: 1104.62, rend: 11.05, final: 1115.67 },
                    ].map(row => (
                      <tr key={row.mes} className="border-b border-gray-700/50">
                        <td className="py-2 px-2 text-white">{row.mes}</td>
                        <td className="py-2 px-2 text-gray-300 text-right">R$ {row.inicial.toFixed(2)}</td>
                        <td className="py-2 px-2 text-green-400 text-right">+R$ {row.rend.toFixed(2)}</td>
                        <td className="py-2 px-2 text-white text-right font-medium">R$ {row.final.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <CardConceito titulo="Risco">
              Todo investimento envolve algum nivel de risco. Regra basica: quanto maior o potencial
              de retorno, maior o risco. Poupanca e Tesouro Direto sao mais seguros mas rendem menos.
              Acoes e Cripto podem render muito mais, mas tambem podem cair drasticamente.
            </CardConceito>

            <CardConceito titulo="Diversificacao">
              E a estrategia de nao colocar "todos os ovos na mesma cesta". Em vez de investir tudo em um
              unico ativo, voce distribui entre diferentes tipos. Assim, se um vai mal, os outros compensam.
              O CashWise mostra sua diversificacao no grafico de alocacao por tipo.
            </CardConceito>
          </div>
        </SecaoColapsavel>

        {/* Tipos de investimento */}
        <SecaoColapsavel titulo="Tipos de Investimento" icone={PieChart}>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            O CashWise suporta 7 categorias de investimento, cobrindo as principais opcoes
            do mercado brasileiro:
          </p>
          <div className="grid gap-3">
            {TIPOS_INVESTIMENTO.map(inv => (
              <div key={inv.tipo} className="bg-gray-700/40 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold text-sm">{inv.tipo}</h4>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${CORES_RISCO[inv.risco]}`}>
                    Risco {inv.risco}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-1.5">{inv.descricao}</p>
                <p className="text-gray-500 text-xs">Indicado para: {inv.para}</p>
              </div>
            ))}
          </div>

          {/* Sugestao de diversificacao */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
            <div className="flex gap-2 items-start">
              <Lightbulb size={16} className="text-blue-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-blue-400 font-semibold text-sm mb-1">Exemplo de diversificacao</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Com R$ 10.000 para investir, em vez de colocar tudo em um unico tipo, voce poderia distribuir:
                  40% em Tesouro Direto (seguranca), 30% em CDB (rendimento moderado),
                  20% em FIIs (renda passiva) e 10% em Cripto (aposta de alto retorno).
                </p>
              </div>
            </div>
          </div>
        </SecaoColapsavel>

        {/* Exemplos praticos de como cadastrar */}
        <SecaoColapsavel titulo="Exemplos Praticos: Como Cadastrar no Site" icone={ClipboardList}>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            Muita gente tem duvida de como preencher os campos na hora de cadastrar um investimento,
            principalmente quando o investimento paga todo mes (como FIIs) ou quando o rendimento muda
            ao longo do tempo. Veja exemplos reais abaixo:
          </p>

          {/* Exemplo FIIs */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
            <h4 className="text-green-400 font-semibold text-sm mb-3">Exemplo 1: FII que paga dividendo todo mes</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              Voce comprou cotas de um FII por <span className="text-white font-medium">R$ 500,00</span> e ele
              te paga <span className="text-white font-medium">R$ 2,70 por mes</span> de dividendo. Como cadastrar?
            </p>

            <div className="bg-gray-800/80 rounded-lg p-3 mb-3">
              <p className="text-white font-medium text-sm mb-2">Na hora de cadastrar, preencha assim:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Tipo</td>
                      <td className="py-1.5 px-2 text-white text-right">FIIs</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Descricao</td>
                      <td className="py-1.5 px-2 text-white text-right">MXRF11 - Maxi Renda</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Data do Aporte</td>
                      <td className="py-1.5 px-2 text-white text-right">Data que voce comprou</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Valor Investido</td>
                      <td className="py-1.5 px-2 text-white text-right font-medium">R$ 500,00</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Rent. Estimada (%)</td>
                      <td className="py-1.5 px-2 text-blue-400 text-right font-medium">6.5</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Rent. Real (%)</td>
                      <td className="py-1.5 px-2 text-green-400 text-right font-medium">0 (comeca em zero)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 text-gray-400">Status</td>
                      <td className="py-1.5 px-2 text-white text-right">Ativo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
              <div className="flex gap-2 items-start">
                <Lightbulb size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-yellow-400 font-medium text-sm mb-1">Como calcular a Rent. Estimada de um FII?</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Pegue o dividendo mensal e multiplique por 12 para ter o valor anual.
                    Depois divida pelo valor que voce investiu e multiplique por 100:
                  </p>
                  <div className="bg-gray-800/80 rounded p-2 mt-2 font-mono text-sm">
                    <p className="text-gray-400">Dividendo anual = R$ 2,70 x 12 = <span className="text-white">R$ 32,40</span></p>
                    <p className="text-gray-400">Rent. Estimada = (32,40 / 500) x 100 = <span className="text-blue-400 font-medium">6.5% ao ano</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/80 rounded-lg p-3">
              <p className="text-white font-medium text-sm mb-2">E depois? Como atualizar todo mes?</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                Conforme os meses passam e voce recebe os dividendos, voce vai atualizando
                a <span className="text-green-400 font-medium">Rent. Real (%)</span> clicando no botao de editar.
                Basta somar os dividendos recebidos, dividir pelo valor investido e multiplicar por 100:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-gray-400 font-medium py-1.5 px-2 text-left">Mes</th>
                      <th className="text-gray-400 font-medium py-1.5 px-2 text-right">Dividendo</th>
                      <th className="text-gray-400 font-medium py-1.5 px-2 text-right">Total Recebido</th>
                      <th className="text-gray-400 font-medium py-1.5 px-2 text-right">Rent. Real</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-white">Mes 1</td>
                      <td className="py-1.5 px-2 text-gray-300 text-right">+R$ 2,70</td>
                      <td className="py-1.5 px-2 text-gray-300 text-right">R$ 2,70</td>
                      <td className="py-1.5 px-2 text-green-400 text-right font-medium">0.54%</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-white">Mes 2</td>
                      <td className="py-1.5 px-2 text-gray-300 text-right">+R$ 2,70</td>
                      <td className="py-1.5 px-2 text-gray-300 text-right">R$ 5,40</td>
                      <td className="py-1.5 px-2 text-green-400 text-right font-medium">1.08%</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-white">Mes 3</td>
                      <td className="py-1.5 px-2 text-gray-300 text-right">+R$ 2,70</td>
                      <td className="py-1.5 px-2 text-gray-300 text-right">R$ 8,10</td>
                      <td className="py-1.5 px-2 text-green-400 text-right font-medium">1.62%</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-white">Mes 6</td>
                      <td className="py-1.5 px-2 text-gray-300 text-right">+R$ 2,70</td>
                      <td className="py-1.5 px-2 text-gray-300 text-right">R$ 16,20</td>
                      <td className="py-1.5 px-2 text-green-400 text-right font-medium">3.24%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 text-white">Mes 12</td>
                      <td className="py-1.5 px-2 text-gray-300 text-right">+R$ 2,70</td>
                      <td className="py-1.5 px-2 text-gray-300 text-right">R$ 32,40</td>
                      <td className="py-1.5 px-2 text-green-400 text-right font-medium">6.48%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Conta: Rent. Real = (Total Recebido / Valor Investido) x 100. Ex mes 3: (8,10 / 500) x 100 = 1.62%
              </p>
            </div>
          </div>

          {/* Exemplo CDB */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <h4 className="text-blue-400 font-semibold text-sm mb-3">Exemplo 2: CDB que rende no vencimento</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              Voce aplicou <span className="text-white font-medium">R$ 2.000</span> em um CDB que promete
              <span className="text-white font-medium"> 120% do CDI</span> (aproximadamente 13% ao ano).
              O CDB vence em 1 ano e voce so recebe tudo no final.
            </p>

            <div className="bg-gray-800/80 rounded-lg p-3 mb-3">
              <p className="text-white font-medium text-sm mb-2">Na hora de cadastrar:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Tipo</td>
                      <td className="py-1.5 px-2 text-white text-right">CDB</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Descricao</td>
                      <td className="py-1.5 px-2 text-white text-right">CDB Banco Inter 120% CDI</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Valor Investido</td>
                      <td className="py-1.5 px-2 text-white text-right font-medium">R$ 2.000,00</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Rent. Estimada (%)</td>
                      <td className="py-1.5 px-2 text-blue-400 text-right font-medium">13</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 text-gray-400">Rent. Real (%)</td>
                      <td className="py-1.5 px-2 text-green-400 text-right font-medium">0 (atualiza quando vencer)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Como o CDB so paga no vencimento, voce pode atualizar a Rent. Real quando verificar
              o saldo na sua corretora (muitas mostram o rendimento acumulado). Quando vencer e
              voce resgatar, coloque a Rent. Real final e mude o status para "Resgatado".
            </p>
          </div>

          {/* Exemplo Acoes */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
            <h4 className="text-orange-400 font-semibold text-sm mb-3">Exemplo 3: Acoes (pode subir ou cair)</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              Voce comprou acoes da Petrobras por <span className="text-white font-medium">R$ 1.000</span>,
              esperando que valorizem 20% em 1 ano. Mas acoes oscilam — podem subir e cair.
            </p>

            <div className="bg-gray-800/80 rounded-lg p-3 mb-3">
              <p className="text-white font-medium text-sm mb-2">Na hora de cadastrar:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Tipo</td>
                      <td className="py-1.5 px-2 text-white text-right">Acoes</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Descricao</td>
                      <td className="py-1.5 px-2 text-white text-right">PETR4 - Petrobras</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Valor Investido</td>
                      <td className="py-1.5 px-2 text-white text-right font-medium">R$ 1.000,00</td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-1.5 px-2 text-gray-400">Rent. Estimada (%)</td>
                      <td className="py-1.5 px-2 text-blue-400 text-right font-medium">20</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 text-gray-400">Rent. Real (%)</td>
                      <td className="py-1.5 px-2 text-green-400 text-right font-medium">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">
              Acoes mudam de preco todo dia. Atualize a Rent. Real conforme o valor da acao sobe ou desce:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-gray-800/80 rounded p-2.5">
                <p className="text-gray-500 text-xs mb-1">Se a acao subiu para R$ 1.150:</p>
                <p className="text-gray-400 text-sm">Rent. Real = (150 / 1000) x 100 = <span className="text-green-400 font-medium">15%</span></p>
              </div>
              <div className="bg-gray-800/80 rounded p-2.5">
                <p className="text-gray-500 text-xs mb-1">Se a acao caiu para R$ 880:</p>
                <p className="text-gray-400 text-sm">Rent. Real = (-120 / 1000) x 100 = <span className="text-red-400 font-medium">-12%</span></p>
              </div>
            </div>
          </div>

          {/* Resumo geral */}
          <div className="bg-gray-700/40 rounded-lg p-4">
            <h4 className="text-white font-semibold text-sm mb-3">Resumo: quando atualizar a Rent. Real?</h4>
            <div className="space-y-2">
              <div className="flex gap-2 items-start">
                <ArrowRight size={14} className="text-green-400 mt-1 shrink-0" />
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">FIIs</span> — atualize todo mes somando os dividendos recebidos.
                  Conta: (total recebido / valor investido) x 100
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <ArrowRight size={14} className="text-blue-400 mt-1 shrink-0" />
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">CDB / Tesouro / Poupanca</span> — atualize quando quiser, verificando o saldo na corretora ou banco.
                  Conta: ((saldo atual - valor investido) / valor investido) x 100
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <ArrowRight size={14} className="text-orange-400 mt-1 shrink-0" />
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">Acoes / Cripto</span> — atualize quando quiser, com base no preco atual.
                  Pode ser negativo se o preco caiu. Conta: ((preco atual - preco compra) / preco compra) x 100
                </p>
              </div>
            </div>
          </div>
        </SecaoColapsavel>

        {/* Como funciona no CashWise */}
        <SecaoColapsavel titulo="Como Investimentos Funcionam no CashWise" icone={Wallet}>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              A pagina de Investimentos combina gestao de carteira com analise visual de performance.
              Veja o passo a passo:
            </p>

            {/* Passo 1 */}
            <div className="bg-gray-700/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">1</span>
                <h4 className="text-white font-semibold text-sm">Cadastro do Investimento</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Clique em "Novo Investimento" e preencha: tipo, descricao, data do aporte, valor investido,
                rentabilidade estimada e rentabilidade real (comeca em 0%). O sistema valida que o valor
                seja maior que zero antes de salvar.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="bg-gray-700/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">2</span>
                <h4 className="text-white font-semibold text-sm">Visualizacao e KPIs</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                Ao carregar a pagina, voce ve 3 indicadores no topo (apenas investimentos ativos):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-gray-800/80 rounded px-3 py-2">
                  <p className="text-blue-400 text-xs font-medium">Total Investido</p>
                  <p className="text-gray-400 text-xs">Soma de todos os aportes</p>
                </div>
                <div className="bg-gray-800/80 rounded px-3 py-2">
                  <p className="text-purple-400 text-xs font-medium">Patrimonio Atual</p>
                  <p className="text-gray-400 text-xs">Valor + rendimento real</p>
                </div>
                <div className="bg-gray-800/80 rounded px-3 py-2">
                  <p className="text-green-400 text-xs font-medium">Lucro / Prejuizo</p>
                  <p className="text-gray-400 text-xs">Patrimonio - Investido</p>
                </div>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="bg-gray-700/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">3</span>
                <h4 className="text-white font-semibold text-sm">Calculos Automaticos</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                O sistema calcula em tempo real o valor atual e o lucro de cada investimento:
              </p>
              <div className="bg-gray-800/80 rounded-lg p-3 font-mono text-sm space-y-1">
                <p className="text-gray-400">
                  <span className="text-blue-400">Valor Atual</span> = Valor Investido x (1 + Rent. Real / 100)
                </p>
                <p className="text-gray-400">
                  <span className="text-green-400">Lucro</span> = Valor Atual - Valor Investido
                </p>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Ex: R$ 5.000 com 8.3% de rentabilidade real = R$ 5.415,00 (lucro de R$ 415)
              </p>
            </div>

            {/* Passo 4 */}
            <div className="bg-gray-700/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">4</span>
                <h4 className="text-white font-semibold text-sm">Grafico de Alocacao</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Um grafico de pizza mostra como sua carteira esta distribuida entre os tipos de ativo.
                Se perceber que a maioria esta concentrada em alto risco, e um alerta visual
                para rebalancear sua carteira.
              </p>
            </div>

            {/* Passo 5 */}
            <div className="bg-gray-700/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">5</span>
                <h4 className="text-white font-semibold text-sm">Atualizacao e Resgate</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Periodicamente, edite seus investimentos para atualizar a rentabilidade real.
                Quando resgatar, mude o status para "Resgatado" — o investimento continua
                visivel na tabela (historico) mas sai dos calculos de KPI e do grafico.
              </p>
            </div>
          </div>
        </SecaoColapsavel>

        {/* Conexao com Planejamento */}
        <SecaoColapsavel titulo="Conexao com o Planejamento" icone={Target}>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            A pagina de Investimentos se conecta diretamente com a pagina de Planejamento,
            que oferece tres ferramentas complementares:
          </p>
          <div className="grid gap-3">
            <div className="bg-gray-700/40 rounded-lg p-4">
              <h4 className="text-white font-semibold text-sm mb-2">Regra 50/30/20</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                O sistema calcula que 20% da receita deveria ir para investimentos.
                A barra de progresso mostra quanto voce ja investiu no mes versus a meta dos 20%.
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="bg-gray-800/80 rounded px-2 py-1.5 text-center">
                  <p className="text-blue-400 text-lg font-bold">50%</p>
                  <p className="text-gray-500 text-xs">Necessidades</p>
                </div>
                <div className="bg-gray-800/80 rounded px-2 py-1.5 text-center">
                  <p className="text-yellow-400 text-lg font-bold">30%</p>
                  <p className="text-gray-500 text-xs">Desejos</p>
                </div>
                <div className="bg-gray-800/80 rounded px-2 py-1.5 text-center">
                  <p className="text-green-400 text-lg font-bold">20%</p>
                  <p className="text-gray-500 text-xs">Investimentos</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/40 rounded-lg p-4">
              <h4 className="text-white font-semibold text-sm mb-2">Simulador "Quanto Posso Investir"</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                Calcula automaticamente quanto voce ainda pode investir no mes:
              </p>
              <div className="bg-gray-800/80 rounded-lg p-3 text-sm space-y-1">
                <p className="text-gray-400">Receita Total</p>
                <p className="text-red-400">(-) Despesas Fixas</p>
                <p className="text-red-400">(-) Despesas Variaveis</p>
                <p className="text-yellow-400">(-) Reserva Emergencia (10%)</p>
                <p className="text-gray-500 border-t border-gray-600 pt-1 mt-1">= Disponivel para Investir</p>
                <p className="text-orange-400">(-) Ja investido este mes</p>
                <p className="text-green-400 font-medium border-t border-gray-600 pt-1 mt-1">= Ainda pode investir</p>
              </div>
            </div>

            <div className="bg-gray-700/40 rounded-lg p-4">
              <h4 className="text-white font-semibold text-sm mb-2">Metas Financeiras</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Crie metas com valor-alvo, valor atual guardado e aporte mensal. O sistema calcula
                o percentual de progresso e a estimativa de meses restantes para atingir cada meta.
                Muitas metas dependem de investir regularmente — como "juntar R$ 50.000 para
                entrada de um apartamento investindo R$ 1.500/mes".
              </p>
            </div>
          </div>
        </SecaoColapsavel>

        {/* Seguranca */}
        <SecaoColapsavel titulo="Seguranca dos seus Dados" icone={ShieldCheck}>
          <div className="space-y-3">
            <div className="flex gap-2 items-start">
              <ArrowRight size={14} className="text-green-400 mt-1 shrink-0" />
              <p className="text-gray-400 text-sm">
                <span className="text-white font-medium">Autenticacao JWT</span> — Todas as operacoes sao protegidas.
                O sistema verifica seu token em cada requisicao.
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <ArrowRight size={14} className="text-green-400 mt-1 shrink-0" />
              <p className="text-gray-400 text-sm">
                <span className="text-white font-medium">Dados isolados</span> — Cada usuario so acessa
                seus proprios dados. Nenhum usuario pode ver informacoes de outro.
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <ArrowRight size={14} className="text-green-400 mt-1 shrink-0" />
              <p className="text-gray-400 text-sm">
                <span className="text-white font-medium">Validacao dupla</span> — Os dados sao validados
                tanto no frontend (antes de enviar) quanto no backend (antes de salvar), protegendo
                contra dados incorretos.
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <ArrowRight size={14} className="text-green-400 mt-1 shrink-0" />
              <p className="text-gray-400 text-sm">
                <span className="text-white font-medium">Operacoes atomicas</span> — Se algo falhar durante
                uma operacao de escrita, nenhuma alteracao parcial e salva no banco de dados.
              </p>
            </div>
          </div>
        </SecaoColapsavel>

        {/* Dica final */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-5">
          <div className="flex gap-3 items-start">
            <AlertTriangle size={20} className="text-yellow-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-yellow-400 font-semibold text-sm mb-1">Lembre-se</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                O CashWise e uma ferramenta de controle e acompanhamento. As decisoes de investimento
                sao suas. Estude, diversifique e invista com consciencia. Se tiver duvidas,
                procure um profissional de financas certificado.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Guia
