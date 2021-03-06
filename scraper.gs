// Guarda um pedaço da URL de requisição na variável base_url
var base_url = "https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/";

// Guarda o nome de cada pasta na planilha
var sheet_dias = "Dias";
var sheet_acumulo = "Acumulo";
var sheet_semana = "Semana";
var sheet_regiao = "Regiao";
var sheet_geral = "Geral";
var sheet_mapa = "Mapa";

// Guarda parâmetros da requisição na variável fetch_payload
var fetch_payload = {
  "credentials":"omit","headers":{
    "accept":"application/json, text/plain, */*",
    "accept-language":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-fetch-dest":"empty",
    "sec-fetch-mode":"cors",
    "sec-fetch-site":"cross-site",
    "x-parse-application-id":"unAFkcaNDeXajurGB7LChj8SgQYS2ptm"
  },
  "referrer":"https://covid.saude.gov.br/",
  "referrerPolicy":"no-referrer-when-downgrade",
  "body":null,
  "method":"GET",
  "mode":"cors"
}

// Cria função para verificar se os dados foram atualizados no site
// Caso os dados não tenham sido atualizados, nada é feito
// Caso os dados tenham sido atualizados, executa a função 'main'
function isUpdated() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_geral);
  var request = UrlFetchApp.fetch(base_url + "Portal" + sheet_geral, fetch_payload).getContentText();
  var json = JSON.parse(request);
  var dt_live = json.results[0]['dt_atualizacao'];
  var dt_current = sheet.getRange('E2').getValue();
  if (dt_live == dt_current) {
    Logger.log('Data not updated. Spreadsheet data is up to date.'); 
  }
    else {
      main();
    }
  }

// Função guarda-chuva
function main(){
  // Função que raspa os dados da requisição PortalDias
  function scrapeDias() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_dias);
    var request = UrlFetchApp.fetch(base_url + "Portal" + sheet_dias, fetch_payload).getContentText();
    var json = JSON.parse(request);
    var rows = [],
        data;
    for (i = 0; i < json.results.length; i++) {
      data = json.results[i];
      rows.push([data['label'], data['createdAt'], data['updatedAt'], data['qtd_confirmado'], data['qtd_obito']]);
    }
    var dataRange = sheet.getRange(2, 1, rows.length, 5);
    dataRange.setValues(rows);
  }
  // Função que raspa os dados da requisição PortalAcumulo
  function scrapeAcumulo() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_acumulo);
    var request = UrlFetchApp.fetch(base_url + "Portal" + sheet_acumulo, fetch_payload).getContentText();
    var json = JSON.parse(request);
    var rows = [],
        data;
    for (i = 0; i < json.results.length; i++) {
      data = json.results[i];
      rows.push([data['label'], data['createdAt'], data['updatedAt'], data['qtd_confirmado'], data['qtd_obito']]);
    }
    var dataRange = sheet.getRange(2, 1, rows.length, 5);
    dataRange.setValues(rows);    
  }
  // Função que raspa os dados da requisição PortalSemana
  function scrapeSemana() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_semana);
    var request = UrlFetchApp.fetch(base_url + "Portal" + sheet_semana, fetch_payload).getContentText();
    var json = JSON.parse(request);
    var rows = [],
        data;
    for (i = 0; i < json.results.length; i++) {
      data = json.results[i];
      rows.push([data['label'], data['createdAt'], data['updatedAt'], data['qtd_confirmado'], data['qtd_obito']]);
    }
    var dataRange = sheet.getRange(2, 1, rows.length, 5);
    dataRange.setValues(rows); 
  }
  // Função que raspa os dados da requisição PortalRegiao
  function scrapeRegiao() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_regiao);
    var request = UrlFetchApp.fetch(base_url + "Portal" + sheet_regiao, fetch_payload).getContentText();
    var json = JSON.parse(request);
    var rows = [],
        data;
    var lastRow = sheet.getLastRow();
    for (i = 0; i < json.results.length; i++) {
      data = json.results[i];
      rows.push([data['nome'], data['percent'], data['qtd'], data['createdAt'], data['updatedAt']]);
    }
    var dataRange = sheet.getRange(lastRow+1, 1, rows.length, 5);
    dataRange.setValues(rows);  
  };
  // Função que raspa os dados da requisição PortalGeral
  function scrapeGeral() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_geral);
    var request = UrlFetchApp.fetch(base_url + "Portal" + sheet_geral, fetch_payload).getContentText();
    var json = JSON.parse(request);
    var rows = [],
        data;
    for (i = 0; i < json.results.length; i++) {
      data = json.results[i];
      rows.push([data['total_confirmado'], data['createdAt'], data['updatedAt'], data['total_obitos'], data['dt_atualizacao'], data['total_letalidade'].slice(0,-1)]);
    }
    var dataRange = sheet.getRange(2, 1, rows.length, 6);
    dataRange.setValues(rows);  
  }
   // Função que raspa os dados da requisição PortalMapa     
   function scrapeMapa() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_mapa);
    var request = UrlFetchApp.fetch(base_url + "Portal" + sheet_mapa, fetch_payload).getContentText();
    var json = JSON.parse(request);
    var rows = [],
        data;
    var lastRow = sheet.getLastRow();
    for (i = 0; i < json.results.length; i++) {
      data = json.results[i];
      rows.push([data['nome'], data['qtd_confirmado'], data['latitude'], data['longitude'], data['createdAt'], data['updatedAt']]);
    }
    var dataRange = sheet.getRange(lastRow+1, 1, rows.length, 6);
    dataRange.setValues(rows);  
  }
  // Executa as funções, uma a uma
  scrapeDias();
  scrapeAcumulo();
  scrapeSemana();
  scrapeRegiao();
  scrapeGeral();
  scrapeMapa();
  // Guarda a confirmação da execução no log
  Logger.log('Data updated successfully');
}
