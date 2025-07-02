import React from 'react';
import { Form } from 'react-bootstrap';

export const demographicFields = [
    { id: 'age', label: 'Please select your age.', type: 'select', options: Array.from({ length: 82 }, (_, i) => (i + 18).toString()) },
    { id: 'sex', label: 'Please select your gender.', type: 'select', options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'withdraw', label: 'I do not wish to disclose.' }
    ] },
    { id: 'education', label: 'Please select your highest level of completed education.', type: 'select', options: [
        { value: 'highschool', label: 'High School Diploma / GED' },
        { value: 'associate', label: 'Associate Degree' },
        { value: 'bachelors', label: 'Bachelors Degree' },
        { value: 'masters', label: 'Masters Degree' },
        { value: 'doctorate', label: 'Doctorate Degree' }
    ] },
    { id: 'color-blind', label: 'Are you color-blind?', type: 'select', options: [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
        { value: 'maybe', label: 'I do not wish to disclose.' }
    ] },
    { id: 'color-blind-type', label: 'If yes, what kind of color-blindness?', type: 'select', options: [
        { value: 'red-green', label: 'Red-Green' },
        { value: 'blue-yellow', label: 'Blue-Yellow' },
        { value: 'total', label: 'Total' },
        { value: 'other', label: 'Other' }
    ], dependsOn: { field: 'color-blind', value: 'yes' } },
    { id: 'country', label: 'What country are you from?', type: 'text' },
    { id: 'native-language', label: 'What is your native language?', type: 'text' },
    { id: 'familiarity', label: 'Please select your familiarity with visualization.', type: 'select', options: [
        { value: 'not_familiar', label: 'I have never created a visualization.' },
        { value: 'somewhat', label: 'I am somewhat familiar.' },
        { value: 'very_familiar', label: 'I have created visualization systems before.' }
    ] }
];

export function getInitialDemographicState() {
    return {
        age: '',
        sex: '',
        education: '',
        'color-blind': '',
        'color-blind-type': '',
        country: '',
        'native-language': '',
        familiarity: ''
    };
}

function DemographicForm({ demographicState, setDemographicState, setDemographicsIncomplete }) {
    // Check if all required fields are filled
    React.useEffect(() => {
        let incomplete = false;
        for (let field of demographicFields) {
            if (field.dependsOn) {
                if (demographicState[field.dependsOn.field] === field.dependsOn.value && !demographicState[field.id]) {
                    incomplete = true;
                }
            } else if (!demographicState[field.id]) {
                incomplete = true;
            }
        }
        setDemographicsIncomplete(incomplete);
    }, [demographicState, setDemographicsIncomplete]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setDemographicState({ ...demographicState, [id]: value });
    };

    return (
        <>
            {demographicFields.map(field => {
                if (field.dependsOn && demographicState[field.dependsOn.field] !== field.dependsOn.value) {
                    return null;
                }
                if (field.type === 'select') {
                    return (
                        <Form.Group className={'question'} key={field.id}>
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Select id={field.id} value={demographicState[field.id]} onChange={handleChange}>
                                <option value="" disabled={true}></option>
                                {Array.isArray(field.options)
                                    ? field.options.map(opt =>
                                        typeof opt === 'object'
                                            ? <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            : <option key={opt} value={opt}>{opt}</option>
                                    )
                                    : null}
                            </Form.Select>
                        </Form.Group>
                    );
                } else if (field.type === 'text') {
                    return (
                        <Form.Group className={'question'} key={field.id}>
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control type="text" id={field.id} value={demographicState[field.id]} onChange={handleChange} />
                        </Form.Group>
                    );
                }
                return null;
            })}
        </>
    );
}

export default DemographicForm;
