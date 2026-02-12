# CashWise - Paginas do Site

## Visao Geral do Sistema

O **CashWise** e um sistema de inteligencia financeira pessoal que permite ao usuario ter controle total sobre suas financas. A aplicacao e dividida em 5 paginas principais, cada uma com uma responsabilidade clara:

| Pagina | Funcao Principal |
|--------|-----------------|
| **Dashboard** | Visao geral do mes com KPIs, graficos e alertas |
| **Receitas** | Gerenciamento das fontes de renda |
| **Despesas** | Controle de todos os gastos categorizados |
| **Investimentos** | Gestao da carteira de investimentos com analise de performance |
| **Planejamento** | Regra 50/30/20, simulador de investimento e metas financeiras |

---

## Paginas Complementares (Visao Resumida)

### Dashboard

A pagina principal do sistema. Ao acessar, o usuario ve um painel com 5 indicadores-chave (KPIs) do mes selecionado:

- **Total Recebido** — soma de todas as receitas
- **Total Gasto** — soma de todas as despesas
- **Saldo** — diferenca entre receitas e despesas
- **% Gastos** — percentual da receita comprometido com gastos
- **% Investido** — percentual da receita direcionado a investimentos

Abaixo dos KPIs, dois graficos interativos (barras e pizza) mostram a distribuicao dos gastos por categoria. O Dashboard tambem traz a **Regra 50/30/20** com barras de progresso visuais e um alerta de **despesas pendentes** quando existem contas a pagar.

**Fluxo de dados:** O frontend envia o mes e ano selecionados para o endpoint `GET /api/dashboard?mes=X&ano=Y`. O backend calcula todos os indicadores em tempo real a partir das receitas, despesas e investimentos do usuario, e retorna um objeto JSON completo para o frontend renderizar.

### Receitas

Pagina de CRUD (Criar, Ler, Atualizar, Deletar) para as fontes de renda do usuario. Cada receita possui:

- **Data** — quando o valor foi recebido
- **Fonte** — de onde veio (ex: Salario, Freelance, Dividendos)
- **Tipo** — Fixa ou Variavel
- **Valor** — quantia recebida
- **Observacoes** — campo livre para anotacoes

A pagina exibe uma tabela com todas as receitas do mes, um totalizador no rodape e botoes de edicao/exclusao por linha. Filtros por mes/ano permitem navegar entre periodos.

### Despesas

Similar a pagina de Receitas, porem com mais campos para classificacao detalhada:

- **Data, Descricao, Valor** — informacoes basicas
- **Categoria** — Moradia, Alimentacao, Transporte, Saude, Educacao, Lazer, Vestuario, Investimentos, Outros
- **Tipo** — Fixa ou Variavel (importante para a Regra 50/30/20)
- **Forma de Pagamento** — Dinheiro, PIX, Cartao Credito, Cartao Debito, Transferencia, Boleto
- **Status** — Pago ou Pendente

A pagina oferece filtro por categoria, badges coloridos para status (verde = pago, amarelo = pendente) e totalizador dinamico que se adapta ao filtro aplicado.

---

## Investimentos — O Grande Destaque

### Antes de Comecar: O que Voce Precisa Saber sobre Investimentos

#### O que e um investimento?

Investir e colocar o seu dinheiro para trabalhar por voce. Em vez de deixar o dinheiro parado na conta (onde ele perde valor por causa da inflacao), voce aplica em algum ativo financeiro que gera **rendimento** ao longo do tempo.

Pense assim: se voce tem R$ 1.000 parados, em um ano eles vao comprar menos coisas por causa da inflacao. Mas se voce investir esses R$ 1.000 em um CDB que rende 12% ao ano, ao final de 12 meses voce tera R$ 1.120. Seu dinheiro cresceu.

#### Por que investir?

- **Proteger o poder de compra** — a inflacao corroi o valor do dinheiro ao longo do tempo. Investir e a forma de se proteger disso.
- **Fazer o dinheiro crescer** — com os juros compostos (explicados abaixo), pequenos valores investidos regularmente se transformam em grandes quantias ao longo dos anos.
- **Alcancar objetivos** — seja uma viagem, um carro, a casa propria ou a aposentadoria, investir e o caminho para transformar sonhos em metas alcancaveis.
- **Criar liberdade financeira** — chegar ao ponto onde seus investimentos geram renda suficiente para cobrir suas despesas.

#### Conceitos Fundamentais

**Aporte**
E o valor que voce coloca (investe) em um ativo. Pode ser unico (ex: investir R$ 5.000 de uma vez) ou recorrente (ex: investir R$ 500 todo mes). No CashWise, cada investimento registrado tem um **valor investido** que representa o aporte feito.

**Rendimento / Rentabilidade**
E o ganho que o investimento gera sobre o valor aplicado, geralmente expresso em percentual. Se voce investiu R$ 1.000 e agora tem R$ 1.100, sua rentabilidade foi de 10%. No CashWise, trabalhamos com dois tipos:

- **Rentabilidade Estimada** — o quanto voce espera que o investimento renda (ex: um CDB prometendo 120% do CDI, que equivale a aproximadamente 13% ao ano)
- **Rentabilidade Real** — o quanto o investimento realmente rendeu ate o momento (voce atualiza manualmente conforme acompanha)

**Juros Compostos**
Sao os "juros sobre juros". E o principal motor de crescimento dos investimentos de longo prazo. Exemplo pratico:

| Mes | Valor Inicial | Rendimento 1% | Valor Final |
|-----|--------------|---------------|-------------|
| 1 | R$ 1.000,00 | R$ 10,00 | R$ 1.010,00 |
| 2 | R$ 1.010,00 | R$ 10,10 | R$ 1.020,10 |
| 3 | R$ 1.020,10 | R$ 10,20 | R$ 1.030,30 |
| ... | ... | ... | ... |
| 12 | R$ 1.104,62 | R$ 11,05 | R$ 1.115,67 |

Perceba: no mes 1, o rendimento foi R$ 10,00. No mes 12, ja e R$ 11,05 — porque voce esta ganhando juros sobre os juros dos meses anteriores. Em 10 anos, R$ 1.000 a 1% ao mes viram R$ 3.300. Em 20 anos, R$ 10.890. Esse e o poder dos juros compostos.

**Risco**
Todo investimento envolve algum nivel de risco — a possibilidade de perder parte ou todo o valor investido. De forma geral:

- **Baixo risco**: Poupanca, Tesouro Direto, CDBs de bancos grandes — rendem menos, mas sao mais seguros
- **Medio risco**: FIIs (Fundos Imobiliarios), CDBs de bancos menores — equilibrio entre seguranca e retorno
- **Alto risco**: Acoes, Criptomoedas — podem render muito mais, mas tambem podem cair drasticamente

Nao existe investimento sem risco. A regra basica e: **quanto maior o potencial de retorno, maior o risco.**

**Diversificacao**
E a estrategia de nao colocar "todos os ovos na mesma cesta". Em vez de investir tudo em um unico ativo, voce distribui entre diferentes tipos. Assim, se um investimento vai mal, os outros compensam.

Exemplo: se voce tem R$ 10.000 para investir, em vez de colocar tudo em acoes (alto risco), poderia distribuir:
- R$ 4.000 em Tesouro Direto (seguranca)
- R$ 3.000 em CDB (rendimento moderado)
- R$ 2.000 em FIIs (renda passiva)
- R$ 1.000 em Cripto (aposta de alto retorno)

O CashWise mostra a sua diversificacao atraves do **grafico de alocacao por tipo**, permitindo visualizar se sua carteira esta equilibrada.

---

### Como a Area de Investimentos Funciona no CashWise

#### Visao Geral

A pagina de Investimentos e o modulo mais completo do sistema. Ela combina gestao de carteira com analise visual de performance, permitindo que o usuario:

1. Cadastre todos os seus investimentos
2. Acompanhe a rentabilidade de cada um
3. Visualize o patrimonio total e o lucro/prejuizo
4. Analise a diversificacao da carteira por tipo de ativo

#### Estrutura de Dados de um Investimento

Cada investimento armazenado no sistema possui os seguintes campos:

| Campo | Descricao | Exemplo |
|-------|-----------|---------|
| **Tipo** | Categoria do investimento | CDB, Acoes, FIIs, Cripto, Tesouro Direto, Poupanca, Outros |
| **Descricao** | Nome ou detalhes do investimento | "CDB Banco Inter 120% CDI" |
| **Data do Aporte** | Quando o investimento foi feito | 15/01/2026 |
| **Valor Investido** | Quanto foi aplicado (em R$) | R$ 5.000,00 |
| **Rent. Estimada** | Percentual esperado de rendimento | 12.5% |
| **Rent. Real** | Percentual real de rendimento atual | 8.3% |
| **Status** | Se o investimento esta ativo ou foi resgatado | Ativo / Resgatado |

#### O Fluxo Completo: Do Cadastro a Visualizacao

**1. Cadastro do Investimento**

O usuario clica em "Novo Investimento" e preenche um formulario modal com todos os campos listados acima. O formulario possui validacao: o valor investido deve ser maior que zero, a rentabilidade estimada e obrigatoria, e a rentabilidade real comeca em 0% (ja que o investimento acabou de ser feito).

Ao salvar, o frontend envia os dados para o endpoint `POST /api/investimentos`. O backend associa o investimento ao usuario logado (via JWT), valida os dados e persiste no banco PostgreSQL.

**2. Listagem e Visualizacao**

Ao carregar a pagina, o frontend chama `GET /api/investimentos`, que retorna todos os investimentos do usuario. O backend filtra automaticamente pelo `usuarioId` extraido do token JWT, garantindo que cada usuario so veja seus proprios dados.

A pagina exibe:

- **3 KPI Cards** no topo com os totais calculados
- **Grafico de Pizza** com a alocacao por tipo (diversificacao)
- **Tabela completa** com todos os investimentos e colunas calculadas

**3. Calculos Realizados no Frontend**

Os calculos principais sao feitos em tempo real no frontend, a partir dos dados brutos do backend:

**Valor Atual de cada investimento:**
```
valorAtual = valorInvestido * (1 + rentabilidadeReal / 100)
```
Exemplo: Se voce investiu R$ 5.000 e a rentabilidade real esta em 8.3%:
```
valorAtual = 5.000 * (1 + 8.3 / 100) = 5.000 * 1.083 = R$ 5.415,00
```

**Lucro/Prejuizo de cada investimento:**
```
lucro = valorAtual - valorInvestido
```
No exemplo: R$ 5.415,00 - R$ 5.000,00 = **R$ 415,00 de lucro**

**KPIs de Resumo (apenas investimentos ativos):**
- **Total Investido** = soma de todos os `valorInvestido` onde status = "Ativo"
- **Patrimonio Atual** = soma de todos os `valorAtual` calculados
- **Lucro / Prejuizo** = Patrimonio Atual - Total Investido

O card de Lucro/Prejuizo muda de cor dinamicamente: **verde** quando positivo, **vermelho** quando negativo.

**4. Grafico de Alocacao**

O grafico de pizza e gerado agrupando os investimentos ativos por tipo e somando seus valores investidos. Isso permite visualizar imediatamente como a carteira esta distribuida.

Exemplo visual:
- CDB: 40% (azul)
- FIIs: 25% (laranja)
- Acoes: 20% (verde)
- Cripto: 15% (roxo)

Se o usuario percebe que 60% da carteira esta em acoes e cripto (alto risco), o grafico funciona como um alerta visual para rebalancear.

**5. Atualizacao da Rentabilidade**

Periodicamente, o usuario pode editar um investimento para atualizar a **rentabilidade real**. Isso e importante porque:

- A rentabilidade estimada e uma projecao (ex: "este CDB promete 120% do CDI")
- A rentabilidade real e o que de fato aconteceu (ex: "ate agora rendeu 8.3%")

Ao atualizar, todos os calculos (valor atual, lucro, patrimonio) sao recalculados automaticamente.

**6. Resgate**

Quando o usuario resgata um investimento, ele edita o registro e muda o status de "Ativo" para "Resgatado". Investimentos resgatados:

- Continuam visiveis na tabela (historico)
- Sao **excluidos** dos calculos de KPI e do grafico de alocacao
- Permitem ao usuario manter um registro completo de toda a sua trajetoria de investimentos

**7. Exclusao**

Se o usuario cadastrou um investimento por engano, pode excluir permanentemente atraves do botao de lixeira. O sistema pede confirmacao antes de deletar, e mostra feedback em caso de erro.

#### Conexao com o Planejamento

A pagina de Investimentos nao funciona sozinha — ela se conecta diretamente com a pagina de **Planejamento**, que oferece tres ferramentas complementares:

**Regra 50/30/20**
O sistema calcula automaticamente que 20% da receita deveria ir para investimentos. A barra de progresso mostra quanto ja foi investido no mes vs. a meta dos 20%. Se ultrapassar, a barra fica vermelha com uma sugestao de reducao.

O calculo no backend identifica despesas com categoria "Investimentos" e compara com a receita total:
```
percentualInvestido = (gastoCategoriInvestimentos / totalReceitas) * 100
```

**Simulador "Quanto Posso Investir"**
O simulador faz a conta completa:
```
Receita Total
(-) Despesas Fixas
(-) Despesas Variaveis
(-) Reserva de Emergencia (10% da receita)
= Disponivel para Investir
(-) Ja investido este mes
= Ainda pode investir
```

Isso conecta os dados de receitas, despesas e investimentos em uma unica visualizacao, respondendo a pergunta mais importante: **quanto dinheiro eu posso investir este mes sem comprometer minhas contas?**

**Metas Financeiras**
O usuario pode criar metas com valor-alvo, valor atual guardado e aporte mensal. O sistema calcula:
- Percentual de progresso
- Estimativa de meses restantes para atingir a meta

As metas se conectam ao conceito de investimento porque muitas delas dependem de investir regularmente (ex: "Juntar R$ 50.000 para dar entrada em um apartamento investindo R$ 1.500/mes").

---

### Tipos de Investimento Suportados

O CashWise suporta 7 categorias de investimento, cobrindo o espectro completo de opcoes disponiveis no mercado brasileiro:

| Tipo | O que e | Risco | Para quem |
|------|---------|-------|-----------|
| **CDB** | Certificado de Deposito Bancario. Voce empresta dinheiro para o banco e recebe juros. | Baixo | Iniciantes, quem quer seguranca |
| **Tesouro Direto** | Titulos publicos do governo federal. E considerado o investimento mais seguro do Brasil. | Baixo | Todos os perfis, excelente para reserva de emergencia |
| **Poupanca** | A caderneta de poupanca tradicional. Rende pouco, mas e simples e sem imposto de renda. | Muito Baixo | Quem esta comecando e quer simplicidade |
| **FIIs** | Fundos de Investimento Imobiliario. Voce compra cotas de fundos que investem em imoveis e recebe alugueis mensais. | Medio | Quem quer renda passiva mensal |
| **Acoes** | Partes de empresas negociadas na bolsa de valores. O valor oscila conforme o mercado. | Alto | Quem aceita volatilidade em troca de maior potencial de retorno |
| **Cripto** | Criptomoedas como Bitcoin, Ethereum, etc. Mercado muito volatil. | Muito Alto | Quem entende o mercado e aceita riscos elevados |
| **Outros** | Qualquer outro tipo nao listado (fundos multimercado, debentures, COE, etc.) | Variado | Depende do ativo especifico |

---

### Resumo da Arquitetura Tecnica

```
[Frontend - React]                    [Backend - Spring Boot]           [Banco - PostgreSQL]

Investimentos.jsx  ──GET /api/investimentos──>  InvestimentoController  ──> InvestimentoRepository
     |              <──── Lista JSON ────────       |                        |
     |                                        InvestimentoService           |
     |             ──POST /api/investimentos──>     |                   investimentos (tabela)
     |              <──── Investimento salvo──       |                        |
     |                                              |                        |
     |-- Calcula KPIs (Total, Patrimonio, Lucro)    |-- Valida dados         |-- Armazena por
     |-- Gera grafico de alocacao                   |-- Verifica usuario     |   usuarioId
     |-- Renderiza tabela com colunas calculadas    |-- @Transactional       |
```

**Seguranca:** Todas as operacoes de investimento sao protegidas por JWT. O backend verifica o token em cada requisicao e filtra os dados pelo usuario logado, garantindo que nenhum usuario acesse investimentos de outro.

**Integridade:** Os services utilizam `@Transactional` para garantir que operacoes de escrita sejam atomicas — se algo falhar no meio do processo, nenhuma alteracao parcial e salva no banco.

**Validacao em duas camadas:**
1. **Frontend** — valida campos obrigatorios, valores numericos e limites antes de enviar
2. **Backend** — valida novamente no controller e service, protegendo contra requisicoes malformadas

---

### Como os Conceitos de Investimento se Conectam com o Sistema

| Conceito | Como aparece no CashWise |
|----------|------------------------|
| **Aporte** | Campo "Valor Investido" ao cadastrar um investimento |
| **Rendimento** | Campos "Rent. Estimada" e "Rent. Real" + coluna "Valor Atual" calculada |
| **Juros Compostos** | Refletidos na rentabilidade real ao longo do tempo |
| **Risco** | Representado pelos diferentes tipos (CDB = baixo, Cripto = alto) |
| **Diversificacao** | Grafico de pizza "Alocacao por Tipo" mostra a distribuicao da carteira |
| **Patrimonio** | KPI "Patrimonio Atual" soma todos os investimentos ativos com rendimento |
| **Lucro/Prejuizo** | KPI que mostra a diferenca entre patrimonio atual e total investido |
| **Regra 50/30/20** | Pagina de Planejamento monitora se 20% da receita vai para investimentos |
| **Simulador** | Calcula quanto o usuario ainda pode investir no mes atual |
| **Metas** | Permite definir objetivos financeiros com prazo estimado baseado em aportes |
