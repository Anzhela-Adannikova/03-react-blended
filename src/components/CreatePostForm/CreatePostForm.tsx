import css from "./CreatePostForm.module.css";
import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import type { NewPost } from "../../types/post";

interface PostFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function PostForm({ onSuccess, onClose }: PostFormProps) {
  const queryClients = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (newPost: NewPost) => createPost(newPost),
    onSuccess: () => {
      queryClients.invalidateQueries({ queryKey: ["postes"] });
      onSuccess();
    },
  });

  const NoteSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Must be at least 3 characters")
      .max(50, "Must be at most 50 characters"),
    body: Yup.string().max(500, "Must be at most 500 characters"),
  });

  const handleSubmit = (values: NewPost, actions: FormikHelpers<NewPost>) => {
    mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={{ title: "", body: "" }}
      onSubmit={handleSubmit}
      validationSchema={NoteSchema}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="body">Content</label>
            <Field
              id="body"
              as="textarea"
              name="body"
              rows="8"
              className={css.textarea}
            />
            <ErrorMessage name="body" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Create post
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
