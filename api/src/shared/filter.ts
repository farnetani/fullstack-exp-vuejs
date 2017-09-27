import Utils from './utils';

export class Filter{
    protected queryParams: any = {};
    protected where: any = {};
    protected page: Number = 1;
    protected itensPorPagina: Number = 10;

    constructor(queryParams: any){
        this.queryParams = queryParams; //seta o query params na classe

        //Verifica página
        if(queryParams.page){
            let page: Number = parseInt(queryParams.page);
            this.page = page;
        }

        //Verifica itens por pagina
        if(queryParams.qtd){
            let qtd: Number = parseInt(queryParams.qtd);
            this.itensPorPagina = qtd;
        }

        //Chama os filtros padrões
        this.setAtivo();
        this.setCriado();
        this.setAlterado();
    }

    protected setAtivo(){
        if(this.queryParams.ativo){
            this.where.ativo = this.queryParams.ativo;
        }
    }
    
    protected setCriado(){
        if(this.queryParams.criadoIni && this.queryParams.criadoFim){
            this.where.criado = {"$gte": this.queryParams.criadoIni, "$lt": this.queryParams.criadoFim}
        }else if(this.queryParams.criadoIni && !this.queryParams.criadoFim){
            this.where.criado = {"$gte": this.queryParams.criadoIni}
        }else if(!this.queryParams.criadoIni && this.queryParams.criadoFim){
            this.where.criado = {"$lt": this.queryParams.criadoFim}
        }
    } 
    
    protected setAlterado(){
        if(this.queryParams.alteradoIni && this.queryParams.alteradoFim){
            this.where.alterado = {"$gte": this.queryParams.alteradoIni, "$lt": this.queryParams.alteradoFim}
        }else if(this.queryParams.alteradoIni && !this.queryParams.alteradoFim){
            this.where.alterado = {"$gte": this.queryParams.alteradoIni}
        }else if(!this.queryParams.alteradoIni && this.queryParams.alteradoFim){
            this.where.alterado = {"$lt": this.queryParams.alteradoFim}
        }
    } 

    getQuery(){
        return {
            where: this.where,
            page: this.page,
            itensPorPagina: this.itensPorPagina
        }
    }

    //Funções de apoio ===================
    protected like(valor: String) {
        if(!valor) valor = '';
        var regex = new RegExp(Utils.removerAcentos(valor), "i");
        return regex;
    }
    
}