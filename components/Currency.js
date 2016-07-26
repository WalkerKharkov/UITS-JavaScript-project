function Currency(elem){

    if (!elem) return;

    this.currency = {};
    this.elem = elem;
    this.currencyTemplate = "";
    this.bankList = ["ПриватБанк", "ПУМБ", "Укрсоцбанк"];

    this.init();
}

Currency.prototype = Object.create(Helper.prototype);

Currency.prototype.init = function(){
    this.ajaxLoad("GET", 'http://' + location.hostname + '/site/tryCurrency', this.setCurrencyList, this);
};

Currency.prototype.setCurrencyList = function(response, self){
    self.currency = JSON.parse(response);
    self.setBankList(self.bankList, self);
    self.setDelta(self);
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
    for (var i = 0; i <= (self.currency.length - 3); i += 3) {
        self.currencyTemplate += '<tr>' +
                                    '<td>' +
                                        '<p><i>' + self.currency[i].bankName + '</i></p>' +
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
                                            '<mark>' + self.currency[i].rateBuy + '</mark>&nbsp; &nbsp;' +
                                            self.currency[i].rateBuyDeltaTemplate +
                                        '</span>' +
                                        '<span>' +
                                            '<mark>' + self.currency[i + 1].rateBuy + '</mark>&nbsp; &nbsp;' +
                                            self.currency[i + 1].rateBuyDeltaTemplate +
                                        '</span>' +
                                        '<span>' +
                                            '<mark>' + self.currency[i + 2].rateBuy + '</mark>&nbsp; &nbsp;' +
                                            self.currency[i + 2].rateBuyDeltaTemplate +
                                        '</span>' +
                                    '</td>' +
                                    '<td>' +
                                        '<span>' +
                                            '<mark>' + self.currency[i].rateSale + '</mark>&nbsp; &nbsp;' +
                                            self.currency[i].rateSaleDeltaTemplate +
                                        '</span>' +
                                        '<span>' +
                                            '<mark>' + self.currency[i + 1].rateSale + '</mark>&nbsp; &nbsp;' +
                                            self.currency[i + 1].rateSaleDeltaTemplate +
                                        '</span>' +
                                        '<span>' +
                                            '<mark>' + self.currency[i + 2].rateSale + '</mark>&nbsp; &nbsp;' +
                                            self.currency[i + 2].rateSaleDeltaTemplate +
                                        '</span>' +
                                    '</td>' +
                                '</tr>';
    }
    self.currencyTemplate += '</table>';
    self.elem.insertAdjacentHTML("beforeend", self.currencyTemplate);
};

Currency.prototype.setDelta = function(self){
    for (var i = 0; i < self.currency.length; i++){
        if (self.currency[i].rateBuyDelta > 0){
            self.currency[i].rateBuyDeltaTemplate = "<i class='-to-hight'> &nbsp; &#9650;</i>";
        }else if(self.currency[i].rateBuyDelta < 0){
            self.currency[i].rateBuyDeltaTemplate = "<i class='-to-low'> &nbsp; &#9660;</i>";
        }else {
            self.currency[i].rateBuyDeltaTemplate = "";
        }
        if (self.currency[i].rateSaleDelta > 0){
            self.currency[i].rateSaleDeltaTemplate = "<i class='-to-hight'> &nbsp; &#9650;</i>";
        }else if(self.currency[i].rateSaleDelta < 0){
            self.currency[i].rateSaleDeltaTemplate = "<i class='-to-low'> &nbsp; &#9660;</i>";
        }else{
            self.currency[i].rateSaleDeltaTemplate = "";
        }
    }
};

Currency.prototype.setBankList = function(list, self){
    self.currency = self.currency.filter(function(bank){
        return (list.indexOf(bank.bankName) >= 0);
    })
};