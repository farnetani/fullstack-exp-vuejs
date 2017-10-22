export class Filter{
  protected queryParams: any = {}
  protected where: any = {}
  protected page: Number = 1
  protected itensPorPagina: Number = 10

  constructor(queryParams: any){
    this.queryParams = queryParams //seta o query params na classe
    //Verifica página
    if(queryParams.page){
      let page: Number = parseInt(queryParams.page)
      this.page = page
    }
    //Verifica itens por pagina
    if(queryParams.qtd){
      let qtd: Number = parseInt(queryParams.qtd)
      this.itensPorPagina = qtd
    }
    //Chama os filtros padrões
    this.setActive()
    this.setCreated()
    this.setUpdated()
    this.setUsuario()
  }

  protected setActive(){
    if(this.queryParams.active){
      this.where.active = this.queryParams.active
    }
  }
    
  protected setCreated(){
    if(this.queryParams.createdIni && this.queryParams.createdFin){
      this.where.createdAt = {$gte: this.queryParams.createdIni, $lt: this.queryParams.createdFin}
    }else if(this.queryParams.createdIni && !this.queryParams.createdFin){
      this.where.createdAt = {$gte: this.queryParams.createdIni}
    }else if(!this.queryParams.createdIni && this.queryParams.createdFin){
      this.where.createdAt = {$lt: this.queryParams.createdFin}
    }
  } 
    
  protected setUpdated(){
    if(this.queryParams.updatedIni && this.queryParams.updatedFin){
      this.where.updatedAt = {$gte: this.queryParams.updatedIni, $lt: this.queryParams.updatedFin}
    } else if(this.queryParams.updatedIni && !this.queryParams.updatedFin){
      this.where.alterado_em = {$gte: this.queryParams.updatedIni}
    }else if(!this.queryParams.updatedIni && this.queryParams.updatedFin){
      this.where.alterado_em = {$lt: this.queryParams.updatedFin}
    }
  }  
  
  protected setUsuario(){
    if(this.queryParams.usuario_id){
      this.where.usuario_id = this.queryParams.usuario_id
    }
  }

  getQuery(){
    return { where: this.where, page: this.page, itensPorPagina: this.itensPorPagina }
  }

  //Funções de apoio ===================
  protected like(valor: String) {
    if(!valor) valor = ''
    valor = '%'+valor.replace(new RegExp(' ', 'g'), "%")+'%'
    return { $like: valor }
  }    
}