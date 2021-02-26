import { useMutation, useQuery } from '@apollo/client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import FormikStyles from './styles/FormikStyles';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

export default function UpdateProduct({ id }) {
  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: {
      id,
    },
  });

  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  const { inputs, handleChange, clearForm, resetForm } = useForm(data?.Product);

  if (loading) return <p>Loading...</p>;
  return (
    <Formik
      initialValues={{
        name: data?.Product?.name,
        price: data?.Product?.price,
        description: data?.Product?.description,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const res = updateProduct({
          variables: {
            id,
            ...values,
          },
        });
        setSubmitting(false);
      }}
    >
      {({ errors, isSubmitting, setFieldValue }) => (
        <Form>
          <DisplayError error={error || updateError} />
          <FormikStyles>
            <label htmlFor="name">Name</label>
            <Field name="name" type="text" />
            <ErrorMessage name="name" />

            <label htmlFor="price">Price</label>
            <Field name="price" type="number" />
            <ErrorMessage name="price" />

            <label htmlFor="description">Description</label>
            <Field name="description" as="textarea" />
            <ErrorMessage name="description" />
            <button type="submit">Submit</button>
          </FormikStyles>
        </Form>
      )}
    </Formik>
  );
}
