import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Unit } from '../share/models/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  
  private _totalUnitCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  
  baseURL=environment.baseURL;
  
  constructor(private httpClient:HttpClient) {}

  getUnits(id:number, parameters?:object):Observable<Unit[]>{
    return this.httpClient.get(`${this.baseURL}/properties/${id}/units`, {params: {...parameters}, observe: 'response'})
    .pipe(
      map(data=>{
        if(data.headers.get('X-Total-Count')){
          this._totalUnitCount.next(Number(data.headers.get('X-Total-Count')));
        }
        return <Unit[]> data.body;
      })
    );
  }

  getTotalUnitCount():Observable<number>{
    return this._totalUnitCount.asObservable();
  }

  saveUnit(propertyId:number, unit:Unit):Promise<Unit>{
    return this.httpClient.post<Unit>(`${this.baseURL}/properties/${propertyId}/units`, {...unit}).toPromise();
  }

  deleteUnit(propertyId:number, unitId:number){
    return this.httpClient.delete(`${this.baseURL}/properties/${propertyId}/units/${unitId}`).toPromise();
  }

  deleteUnits(propertyId:number, unitIds:Array<number>){
    return this.httpClient.post(`${this.baseURL}/properties/${propertyId}/units/bulkdelete?unitIds=${unitIds.join(',')}`,  {}, { observe: 'response' }).toPromise();
  }
}

export interface UnitParams{
  countRequired?:boolean;
  pageIndex?:number;
  pageSize?:number;
  searchQuery?:string;
}