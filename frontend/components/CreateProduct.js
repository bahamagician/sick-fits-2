import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Router from 'next/router';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';
import FormikStyles from './styles/FormikStyles';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION
  );

  return (
    <div>
      <Formik
        initialValues={{ image: '', name: '', price: '', description: '' }}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await createProduct({
            variables: values,
            refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
          });

          Router.push({
            pathname: `/product/${res.data.createProduct.id}`,
          });
          setSubmitting(false);
        }}
      >
        <Form>
          <FormikStyles>
            <label htmlFor="image">Image</label>
            <Field name="image" type="file" />
            <ErrorMessage name="image" />

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
      </Formik>
    </div>
  );
}
