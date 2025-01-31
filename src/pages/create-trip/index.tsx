import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InvateGuestsSteps } from '../create-trip/steps/invite-guest-steps'
import { InviteGuestsModal } from './invite-guest-modal'
import { DateRange } from 'react-day-picker'
import { api } from '../../lib/axios'




export function CreateTripPage() {
  const navigate = useNavigate()

  const [ isGuestsInputOpen, setIsGuestsInputOpen ] = useState(false)
  const [ isGuestsModalOpen, setIsGuestsModalOpen ] = useState(false)
  const [ isConfirmTripModalOpen, setIsConfirmTripModalOpen ] = useState(false)


  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()


  const [ emailToInvite, setEmailToInvite ] = useState([
    'diego@rockseat.com.br'
  ])

  function openGuestsInput() {
    setIsGuestsInputOpen(true)
  }

  function closeGuestsInput(){
    setIsGuestsInputOpen(false)
  }
  
  function openGuestsModal(){
    setIsGuestsModalOpen(true)
  }

  function closeGuestsModal(){
    setIsGuestsModalOpen(false)
  }

  function openConfirmTripModal(){
    setIsConfirmTripModalOpen(true)
  }

  function closeConfrimTripModal(){
    setIsConfirmTripModalOpen(false)
  }

  function addNewEmailToInvate(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if(!email) {
      return
    }
    
    if(emailToInvite.includes(email)){
      return
    }

    setEmailToInvite([
      ...emailToInvite,
      email
    ])

    event.currentTarget.reset()

  }

  function removeEmailFromInvites(emailToRemove: string){
    const newEmailList = emailToInvite.filter(email => email !== emailToRemove)

    setEmailToInvite(newEmailList)


  }

  async function createTrip(event: FormEvent<HTMLFormElement>){
    event.preventDefault()
    
    console.log(destination)
    console.log(eventStartAndEndDates)
    console.log(emailToInvite)
    console.log(ownerName)
    console.log(ownerEmail)

    if(!destination) {
      return
    }

    if(!eventStartAndEndDates?.from || !eventStartAndEndDates?.to ){
      return
    }

    if(emailToInvite.length === 0) {
      return
    }

    if(!ownerName || !ownerEmail){
      return
    }

    const response = await api.post('/trips', {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
      emails_to_invite: emailToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
    })

    const { tripId } = response.data

    navigate(`/trips/${tripId}`)

  }



  return (
   <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center ">
    <div className="max-w-3xl w-full px-6 text-center space-y-10">

    <div className='flex flex-col items-center gap-3' >
    <img src="/logo.svg" alt="plann.er" />
    <p className="text-zinc-300 text-xl">Convide seus amigos e planeje sua próxima viagem!</p>
    </div>


    <div className='space-y-4'>
      
      <DestinationAndDateStep 
        closeGuestsInput={closeGuestsInput}
        isGuestsInputOpen={isGuestsInputOpen}
        openGuestsInput={openGuestsInput}
        setDestination={setDestination}
        setEventStartAndEndDates={setEventStartAndEndDates}
        eventStartAndEndDates={eventStartAndEndDates}
       />

      {isGuestsInputOpen && (
       <InvateGuestsSteps
          emailToInvite={emailToInvite}
          openConfirmTripModal={openConfirmTripModal}
          openGuestsModal={openGuestsModal}

       />
      )}
    </div>

    <p className="text-sm text-zinc-500">
      Ao planejar sua viagem pela plann.er você automaticamente concorda <br/>
      com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.
    </p>
   </div>


   {isGuestsModalOpen &&(
      <InviteGuestsModal 
        emailToInvite={emailToInvite}
        addNewEmailToInvate={addNewEmailToInvate}
        closeGuestsModal={closeGuestsModal}
        removeEmailFromInvites={removeEmailFromInvites} 
        openGuestsInput={openGuestsInput}       
      />
   )}

   {isConfirmTripModalOpen && (
    <ConfirmTripModal
      closeConfirmModalTrip={closeConfrimTripModal}
      closeGuestsModal={closeGuestsModal}
      createTrip={createTrip}
      setOwnerName={setOwnerName}
      setOwnerEmail={setOwnerEmail}
     />
   )}


   </div>





 )
}

