function Currency(elem){

    if (!elem) return;

    this.currency = {};
    this.currencyList = [];
    this.elem = elem;
    this.currencyTemplate = "";
    this.bankList = ["ПриватБанк", "ПУМБ", "Укрсоцбанк", "РодовIд Банк"];
    this.buffer = {};

    this.init();
}

Currency.prototype = Object.create(Helper.prototype);

Currency.prototype.init = function(){
    this.ajaxLoad("GET", 'http://' + location.hostname + '/site/tryCurrency', this.setCurrencyList, this);
};

Currency.prototype.setCurrencyList = function(response, self){
    self.currency = JSON.parse(response);
    self.setBankList(self.bankList, self);
    self.setDeltaTemplates(self);
    self.currencyTemplate += '<table class="-new-currensy">' +
                                '<tr>' +
                                    '<th>' +
                                        '<span>Банк</span>' +
                                    '</th>' +
                                    '<th>' +
                                        "<span style='font-size: 18px'>&#402;</span>" +
                                    '</th>' +
                                    '<th>' +
                                        '<span>Покупка</span>' +
                                    '</th>' +
                                    '<th>' +
                                        '<span>Продажа</span>' +
                                    '</th>' +
                                '</tr>';
    for (var i = 0; i < self.currencyList.length; i++) {
        self.currencyTemplate += '<tr>' +
                                    '<td>' +
                                        '<p><i>' + self.currencyList[i].bankName + '</i></p>' +
                                    '</td>' +
                                    '<td>' +
                                        '<span>' +
                                            '<b>&euro;</b>' +
                                        '</span>' +
                                        '<span>' +
                                            '<b>$</b>' +
                                        '</span>' +
                                        '<span>' +
                                            '<b>R</b>' +
                                        '</span>' +
                                    '</td>' +
                                    '<td>' +
                                        '<span>' +
                                            '<mark>' + ((self.currencyList[i].EUR) ? self.currencyList[i].EUR.rateBuy : "Нет данных") +
                                            '</mark>&nbsp; &nbsp;' +
                                            ((self.currencyList[i].EUR) ? self.currencyList[i].EUR.rateBuyDeltaTemplate : "") +
                                        '</span>' +
                                        '<span>' +
                                            '<mark>' + ((self.currencyList[i].USD) ? self.currencyList[i].USD.rateBuy : "Нет данных") +
                                            '</mark>&nbsp; &nbsp;' +
                                            ((self.currencyList[i].USD) ? self.currencyList[i].USD.rateBuyDeltaTemplate : "") +
                                        '</span>' +
                                        '<span>' +
                                            '<mark>' + ((self.currencyList[i].RUB) ? self.currencyList[i].RUB.rateBuy : "Нет данных") +
                                            '</mark>&nbsp; &nbsp;' +
                                            ((self.currencyList[i].RUB) ? self.currencyList[i].RUB.rateBuyDeltaTemplate : "") +
                                        '</span>' +
                                    '</td>' +
                                    '<td>' +
                                        '<span>' +
                                            '<mark>' + ((self.currencyList[i].EUR) ? self.currencyList[i].EUR.rateSale : "Нет данных") +
                                            '</mark>&nbsp; &nbsp;' +
                                            ((self.currencyList[i].EUR) ? self.currencyList[i].EUR.rateSaleDeltaTemplate : "") +
                                        '</span>' +
                                        '<span>' +
                                            '<mark>' + ((self.currencyList[i].USD) ? self.currencyList[i].USD.rateSale : "Нет данных") +
                                            '</mark>&nbsp; &nbsp;' +
                                            ((self.currencyList[i].USD) ? self.currencyList[i].USD.rateSaleDeltaTemplate : "") +
                                        '</span>' +
                                        '<span>' +
                                            '<mark>' + (((self.currencyList[i].RUB)) ? self.currencyList[i].RUB.rateSale : "Нет данных") +
                                            '</mark>&nbsp; &nbsp;' +
                                            (((self.currencyList[i].RUB)) ? self.currencyList[i].RUB.rateSaleDeltaTemplate : "") +
                                        '</span>' +
                                    '</td>' +
                                '</tr>';
    }
    self.currencyTemplate += '</table>';
    self.elem.insertAdjacentHTML("beforeend", self.currencyTemplate);
};

Currency.prototype.setDeltaTemplates = function(self){
    for (var i = 0; i < self.currencyList.length; i++){
        for (var field in self.currencyList[i]){
            if (typeof self.currencyList[i][field] == "object"){
                if (self.currencyList[i][field].rateBuyDelta > 0){
                    self.currencyList[i][field].rateBuyDeltaTemplate = "<i class='-to-hight'> &nbsp; &#9650;</i>";
                }else if(self.currencyList[i][field].rateBuyDelta < 0){
                    self.currencyList[i][field].rateBuyDeltaTemplate = "<i class='-to-low'> &nbsp; &#9660;</i>";
                }else {
                    self.currencyList[i][field].rateBuyDeltaTemplate = "";
                }
                if (self.currencyList[i][field].rateSaleDelta > 0){
                    self.currencyList[i][field].rateSaleDeltaTemplate = "<i class='-to-hight'> &nbsp; &#9650;</i>";
                }else if(self.currencyList[i][field].rateSaleDelta < 0){
                    self.currencyList[i][field].rateSaleDeltaTemplate = "<i class='-to-low'> &nbsp; &#9660;</i>";
                }else{
                    self.currencyList[i][field].rateSaleDeltaTemplate = "";
                }
            }
        }
    }
};

Currency.prototype.setBankList = function(list, self){
    self.currency = self.currency.filter(function(bank){
        return (list.indexOf(bank.bankName) >= 0);
    });
    for (var i = 0; i < self.bankList.length; i++){
        self.currencyList[i] = {};
        self.currencyList[i].bankName = self.bankList[i];
    }
    for (i = 0; i < self.currency.length; i++){
        for (var j = 0; j < self.currencyList.length; j++){
            if (self.currency[i].bankName == self.currencyList[j].bankName){
                self.currencyList[j][self.currency[i].codeAlpha] = {};
                self.currencyList[j][self.currency[i].codeAlpha].rateBuy = self.currency[i].rateBuy;
                self.currencyList[j][self.currency[i].codeAlpha].rateBuyDelta = self.currency[i].rateBuyDelta;
                self.currencyList[j][self.currency[i].codeAlpha].rateSale = self.currency[i].rateSale;
                self.currencyList[j][self.currency[i].codeAlpha].rateSaleDelta = self.currency[i].rateSaleDelta;
            }
        }
    }
};