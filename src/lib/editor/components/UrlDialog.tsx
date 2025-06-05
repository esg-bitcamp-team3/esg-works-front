"use client";

import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  UseDialogReturn,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

interface UrlDialogProps {
  dialog: UseDialogReturn;
  mode: "image" | "link";
  onSave: (url: string) => void;
  onCancel: () => void;
}

const UrlDialog = ({ onSave, onCancel, mode, dialog }: UrlDialogProps) => {
  const [value, setValue] = useState<string>("");

  return (
    <Dialog.RootProvider value={dialog} motionPreset="slide-in-bottom">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize={"md"}>
                {mode === "image" ? "이미지 URL 입력" : "링크 URL 입력"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>url</Field.Label>
                  <Input
                    placeholder="https://example.com"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={() => dialog.setOpen(false)}>
                  취소
                </Button>
              </Dialog.ActionTrigger>
              <Button onClick={() => onSave(value)}>확인</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
};

export default UrlDialog;
