# ChartGen

En - Wellcome to Chart Generator, my javascript library for generating graphics;

Pt - Bem vindo ao Chart Generator, minha biblioteca javascript de geração de gráficos;

## Usage / Utilizando

En - The library files "assets/css/chart-gen.css" and "assets/js/chart-gen.js" can be found in the reposiry, besides from their minified versions. Now it's just download and start building your charts;

Br - Os arquivos da biblioteca "assets/css/chart-gen.css" e "assets/js/chart-gen.js" podem ser encontrados no repositório, além de suas versões minificadas. Agora é só baixar e começar a criar seus gráficos;

### Initialization

#### Constructor

// En - Instance of the ChartGen, must have the container that hold the graphic as parameter;
// Br - Instancia do ChartGen, precisa ter o container que irá conter o gráfico como parametro;

-- const myChart = new ChartGen(document.querySelector(selector));

#### Init

// En - Chart data, object that will define the graphic: REQUIRED;
// Br - Dados do gráfico, objeto que definirá o gráfico: REQUIRED;
##### Info
const info = {
    // En - Integer array, where each array index is a dot on the graph: REQUIRED;
    // Br - Array de inteiros, onde cada indice do array é um ponto no gráfico: REQUIRED;
    values: [],
    
}

// En - Initialize the graph according to the passed parameters;
// Br - Inicializa o gráfico de acordo com os parametros passados;

-- myChart.init(info, options, ()=> {
--    callback();
-- });




