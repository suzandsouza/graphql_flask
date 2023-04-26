import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useMutation } from '@apollo/client';
import { CREATE_TASK_MUTATION } from '../'; //import from the backend flask 

const Payment = () => {
  const [name, setName] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [image, setImage] = useState(null);
  const [amount, setAmount] = useState(0);
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const [createTaskMutation] = useMutation(CREATE_TASK_MUTATION);
// all get and set handlers 
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSectionIdChange = (event) => {
    setSectionId(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a payment token using Stripe.js
    const { error, token } = await stripe.createToken(
      elements.getElement(CardElement)
    );

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setSuccess(true);

      // Call the CreateTaskMutation and pass the token and task information
      createTaskMutation({variables: {
          name,sectionId,image,amount,token: token.id
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <br />
      <label>
        Section ID:
        <input type="text" value={sectionId} onChange={handleSectionIdChange} />
      </label>
      <br />
      <label>
        Image:
        <input type="file" onChange={handleImageChange} />
      </label>
      <br />
      <label>
        Amount:
        <input type="number" value={amount} onChange={handleAmountChange} />
      </label>
      <br />
      <label>
        Card detail:
        <CardElement />
      </label>
      {Error && <div>{Error}</div>}
      {Success && <div>Payment successful</div>}
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default Payment;
