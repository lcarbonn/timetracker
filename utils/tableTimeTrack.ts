import type { IPauseTrack } from "./tablePauseTrack"

/**
 * Type for TimeTrack table
 */
export interface IUID {
  id:number
  name?:string
}
/**
 * Type for TimeTrack table
 */
export interface ITimeTrack {
  id:number
  UID:IUID[]
  Start:Date
  End:Date|null
  Duration:number
  Year:number
  Week:number
  PauseDuration:number
  EffectiveDuration:number
  pauses:IPauseTrack[]|undefined
}

export class TimeTrack implements ITimeTrack {
  id:number=0
  UID:IUID[]=[]
  Start:Date=new Date()
  End:Date|null=null
  Duration:number=0
  Year:number=0
  Week:number=0
  PauseDuration:number=0
  EffectiveDuration:number=0
  pauses:IPauseTrack[]|undefined=undefined
}

// export interface ListTimeResponse {
//   count:number
//   next:string|null
//   previous:string|null
//   results: ITimeTrack[]
// }

// export const trackFromRaw = (raw:any) => {
//   const client = raw["Client"][0]
//   return {
//       id : raw.id,
//       numFac : raw["NumFac"],
//       date : new Date(raw["Date"]),
//       index : raw["Index"],
//       num : raw["#Num"],
//       comment : raw["Comment"],
//       client : client?client.value:undefined,
//       statut : statut?statut.value:undefined,
//       totalHT : raw["Total HT"],
//       totalTTC : raw["Total TTC"],
//       ca : ca?ca.value:undefined,
//       tva : Number(raw["Taux TVA"]),
//       paymentDelay : dlp?dlp.value:undefined,
//       bdc : raw["Bon de Commande"],
//       payDate : payd?new Date(payd):undefined,
//       anneeCa : anca?anca.value:undefined,
//     }
//   }

// export const factureToRaw = (facture:IFactureNew) :any => {
//       const raw =
//         {
//         id:facture.id,
//         ["Date"]: facture.date? new Date(facture.date).toISOString().substring(0,10):null,
//         ["#Num"]: facture.num,
//         ["Comment"]: facture.comment,
//         ["Taux TVA"]: facture.tva,
//         ["Statut"]: facture.statut,
//         ["Bon de Commande"]: facture.bdc,
//         ["Date Paiement"]: facture.payDate? new Date(facture.payDate).toISOString().substring(0,10):null,
//         ["Client"]: facture.client? [facture.client]:[],
//         ["CA"]: facture.ca?[facture.ca]:[],
//         }
//       return raw
//     }
