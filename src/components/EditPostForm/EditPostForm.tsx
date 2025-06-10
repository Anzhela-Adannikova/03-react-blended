import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import css from "./EditPostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService";
import type { Post } from "../../types/post";

interface EditPostFormProps {
  post: Post;
  onSuccess: () => void;
  onClose: () => void;
}

export default function EditPostForm({
  post,
  onSuccess,
  onClose,
}: EditPostFormProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (postData: { id: number; title: string }) => editPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postes"] });
      onSuccess();
    },
  });

  const NoteSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Must be at least 3 characters")
      .max(50, "Must be at most 50 characters"),
    body: Yup.string().max(500, "Must be at most 500 characters"),
  });

  const handleSubmit = (
    value: { title: string; body: string },
    actions: FormikHelpers<{ title: string; body: string }>
  ) => {
    mutate({ id: post.id, title: value.title });
    actions.setSubmitting(false);
    onClose();
  };

  return (
    <Formik
      initialValues={{ title: post.title, body: post.body || "" }}
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
              rows={8}
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
              Edit post
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
