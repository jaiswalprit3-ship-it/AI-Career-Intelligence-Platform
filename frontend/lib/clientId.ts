import { v4 as uuidv4 } from 'uuid'

export function getClientId(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  let clientId = localStorage.getItem('client_id')

  if (!clientId) {
    clientId = uuidv4()
    localStorage.setItem('client_id', clientId)
  }

  return clientId
}


