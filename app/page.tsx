"use client"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from "@headlessui/react"
import Email from './email'


interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}

export default function Home() {
  const [events, setEvents] = useState([
    { title: 'Skills Slot'},
    { title: 'Special Lab' },
    { title: 'Academics'},
    { title: 'Periodical Test'},
    { title: 'Semester Exam'},
    { title: 'T&P'}

    
  ])

  const [allEvents, setallEvents] = useState<Event[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)
  const [newEvent, setNewEvent] = useState<Event>({
    title: '',
    start: '',
    allDay: false,
    id: 0
  })

  useEffect(() => {
    let draggable = document.getElementById('draggable-el')
    if (draggable) {
      new Draggable(draggable, {
        itemSelector: ".fc-event", eventData: function (eventEl) {
          let title = eventEl.getAttribute("title")
          let id = eventEl.getAttribute("data")
          let start = eventEl.getAttribute("start")
          return { title, id, start }
        }
      })
    }
  })

  // All the functions are written here

  function handleDateClick(arg: { date: Date, allDay: boolean }) {
    setNewEvent({ ...newEvent, start: arg.date, allDay: arg.allDay, id: new Date().getTime() })
    setShowModal(true)
  }

  function addEvent(data: DropArg) {
    const event = { ...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime() }
    setallEvents([...allEvents, event])
  }

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true)
    setIdToDelete(Number(data.event.id))
  }
  function handleDelete() {
    setallEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)))
    setShowDeleteModal(false)
    setIdToDelete(null)
  }

  function handleCancel() {
    setShowModal(false)
    setNewEvent({
      title: '',
      start: '',
      allDay: false,
      id: 0
    })
    setShowDeleteModal(false)
    setIdToDelete(null)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setallEvents([...allEvents, newEvent])
    setShowModal(false)
    setNewEvent({
      title: '',
      start: '',
      allDay: false,
      id: 0
    })
  }

  window.addEventListener('beforeunload', () =>
  {
    event?.preventDefault();
  }) //to stop reloading of the page



  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-400">Event Scheduler</h1>
      </nav>
      <main className="flex flex-col items-center ">
        <div className="grid grid-cols-8">
          <div className="col-span-7">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              // Month week button
              headerToolbar={{ left: 'prev next today', center: 'title', right: 'dayGridYear dayGridMonth timeGridWeek' }}
              events={allEvents}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
            />
          </div>
          <div id="draggable-el" className="ml-5 w-30 border-2 p-2 rounded-md bg-violet-100 b-20 ">
            <h1 className="font-bold text-lg text-center">Common Events</h1>
            {events.map(event => (
              <div className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white" title={event.title}>
                {event.title}
              </div>
            ))}
          </div>
        </div>


          {/* request events */}
          <Email/>

        <Transition.Root show={showDeleteModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowDeleteModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 px-250">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  // as={Fragment} 
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-50"
                  enterTo="opacity-100 translate-y-0 sm:scale-150"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-50 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-ig 
            bg-white text-left shadow-x1 transition-all sm:my-8 sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-2 text-center sm:ml-3 sm:mt-0 ">
                          <Dialog.Title className=" text-black">
                            Are you sure to delete this event ?
                          </Dialog.Title>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 py-3  sm:px-5">
                      <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-1 text-sm
                text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={handleDelete}>Delete</button>&nbsp;&nbsp;
                      <button type="button" className="inline-flex w-full justify-center rounded-md bg-white-500 px-3 py-1 text-sm
                text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-white-50 sm:mt-0 sm:w-auto" onClick={handleCancel}> Cancel</button>
                    </div>
                  </Dialog.Panel>
                  <div className="bg-opacity-75 transition-opacity" />
                  {/* it's deleting but no sure msg indication*/}
                </Transition.Child>

              </div>
            </div>

          </Dialog>
        </Transition.Root>

        {/* Event creation and deletion */}
        
        <Transition.Root show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Add Event
                      </Dialog.Title>
                      <form action="submit" onSubmit={handleSubmit}>
                        <div className="mt-2">
                          <input type="text" name="title" className="block w-full rounded-md border-0 py-3 text-gray-900 
                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                            focus:ring-2 
                            focus:ring-inset focus:ring-violet-500 
                            sm:text-sm sm:leading-6"
                            value={newEvent.title} onChange={(e) => handleChange(e)} placeholder="Title" />
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25"
                            disabled={newEvent.title === ''}
                          >
                            Create
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          // onClick={handleCloseModal}

                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </main>
    </>
  )
}


