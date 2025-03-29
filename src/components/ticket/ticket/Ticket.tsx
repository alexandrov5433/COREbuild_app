import styles from './ticket.module.css';
import { TicketData } from '../../../lib/definitions';
import { convertTimeToDate } from '../../../lib/util/time';
import { ChangeEvent, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks/reduxTypedHooks';
import answerTicket from '../../../lib/actions/ticket/answerTicket';
import { setMessageData } from '../../../redux/popupMessageSlice';

export default function Ticket({
    ticketData,
    triggerTicketsRefresh
}: {
    ticketData: TicketData,
    triggerTicketsRefresh: () => void
}) {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.user);

    const initFormValidityState = {
        content_answer: {
            isValid: false,
            isTouched: false,
        }
    }
    const [formState, setFormState] = useState(initFormValidityState);
    const [answerSubmissionLoading, setAnswerSubmissionLoading] = useState(false);

    const ticketAnswerForm = useRef(null);
    // TicketData = {
    //     id: number,
    //     title: string,
    //     status: 'open' | 'closed',
    //     content_question: string,
    //     content_answer: string | null,
    //     time_open: number,
    //     time_close: number | null,
    //     email_for_answer: string,
    //     userID_submit: number | null,
    //     userID_employee: number | null
    // }

    function validateAnswer(e: ChangeEvent<HTMLTextAreaElement>) {
        const val = e.currentTarget.value;
        let isValueValid = Boolean(val);
        setFormState(state => {
            const newState = {...state};
            newState.content_answer.isValid = isValueValid;
            newState.content_answer.isTouched = true;
            return newState;
        });
    }

    async function submitAnswer() {
        const formData = new FormData(ticketAnswerForm.current!);
        if (!formData || !userData.is_employee) {
            return;
        }
        setAnswerSubmissionLoading(true);
        formData.append('id', ticketData.id.toString());
        const action = await answerTicket(formData);
        if (action.responseStatus === 200) {
            triggerTicketsRefresh();
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: 'Answer submitted!',
                type: 'success'
            }));
        } else if (action.responseStatus === 400) {
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: action.msg,
                type: 'error'
            }));
        }
        setAnswerSubmissionLoading(false);
    }

    return (
        <div id={ticketData.id.toString() || ''} className={styles.mainContainer}>
            <h4>Ticket ID: {ticketData.id}</h4>
            <section className={styles.infoSection}>
                <h5><i>Title:</i> {ticketData.title}</h5>
                <p><i>Status:</i> <span className={ticketData.status == 'closed' ? styles.closed : styles.open}>{ticketData.status}</span></p>
                <p><i>Submitted On:</i> {convertTimeToDate(ticketData.time_open || 0)}</p>
                <p><i>Ticket Author:</i> {ticketData.userID_submit ? `UserID: ${ticketData.userID_submit}` : 'Guest'}</p>
                <p><i>Email For Reply:</i> {ticketData.email_for_answer}</p>
                <p><i>Question:</i> {ticketData.content_question}</p>

                {
                    ticketData.status == 'open' ? '' :
                        <>
                            <p><i>Closed On:</i> {convertTimeToDate(ticketData.time_close || 0)}</p>
                            <p><i>Answer:</i> {ticketData.content_answer}</p>
                            <p><i>Answered From EmployeeID:</i> {ticketData.userID_employee}</p>
                        </>
                }
            </section>
            {
                ticketData.status == 'closed' ? '' :
                    <section>
                        <form ref={ticketAnswerForm} id={`ticket-${ticketData.id}`}>
                            <h4>Answer Ticket</h4>
                            <textarea className={`form-control ${formState.content_answer.isTouched ? (
                                    formState.content_answer.isValid ? 'is-valid' : 'is-invalid'
                                ) : ''
                                }`} name="content_answer" onChange={e => validateAnswer(e)}/>
                            <div className="mt-3">
                                <button className="btn btn-danger" type="button" disabled={!formState.content_answer.isValid || answerSubmissionLoading} onClick={submitAnswer}>Submit Answer</button>
                            </div>
                        </form>
                    </section>
            }
        </div>
    );
}