import PropTypes from 'prop-types';
import { createContext, useReducer } from "react"
import questions from '../data/questions'

// Criando uma constante que vai determinar o stagio que o usuario esta no jogo

const STAGES = ["Start", "Playing", "End"]

const initialState = {
    gameStage: STAGES[0],
    questions,

    // mapeado o estado
    currentQuestion: 0,

    //pontuação 
    score: 0,

    //resposta selecionada 
    aswerSelected: false,
}


const quizReducer = (state, action) => {

    switch (action.type) {
        case "CHANGE_STATE":
            return {
                //mantenho o estagio da aplicacao pegando o objeto de forma integral 
                ...state,
                gameStage: STAGES[1]
            };
        case "REORDER_QUESTIONS": {

            const reorderedQuesttions = questions.sort(() => { return Math.random() - 0.5 })
            return {
                ...state,
                questions: reorderedQuesttions,
            }
        };
        case "CHANGE_QUESTION": {
            const nextQuestion = state.currentQuestion + 1
            let endGame = false
            if (!questions[nextQuestion]) {
                endGame = true
            }

            return {
                ...state,
                currentQuestion: nextQuestion,
                gameStage: endGame ? STAGES[2] : state.gameStage,
                answerSelected: false
            };
        };
        case "NEW_GAME":
            return initialState;

        case "CHECK-ANSWER": {
            const answer = action.payload.answer
            const option = action.payload.option
            // Verifica se já há uma resposta selecionada
            if (state.answerSelected) {
                // Se a resposta já foi selecionada, retorna o estado atual sem alterar a pontuação
                return state;
            }

            let correctAnswer = 0
            if (answer === option) correctAnswer = 1;
            return {
                ...state,
                score: state.score + correctAnswer,
                answerSelected: option,
            };
        };
        default:
            return state
    }
}
// iniciacilizando contexto e invocar o hook
export const QuizContext = createContext() // Chamada do hook createContext

// criar um provider que vai prover a minha aplicaçao 
export const QuizProvider = ({ children }) => {
    const value = useReducer(quizReducer, initialState)
    return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

// validação PropTypes ao seu componente 
QuizProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

