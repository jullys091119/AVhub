"use client"
import React, { useState } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';

function Login({ sqlPass, isOpen, onClose, onSuccess }) {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseModal = () => {
    setInputValue("");
    setErrorMessage(""); 
    onClose(); 
  };

  const handleIngresar = () => {
    const claveLimpia = inputValue.trim();

    if (claveLimpia === "") {
      setErrorMessage("Por favor ingresa una contraseña.");
      return;
    }

    if (claveLimpia === sqlPass) {
      setErrorMessage("");
      setInputValue("");
      onSuccess(); 
    } else {
      setErrorMessage("La contraseña es incorrecta.");
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={handleCloseModal}>
      <AlertDialogBackdrop />
      <AlertDialogContent 
        style={{ width: '88%', maxWidth: 440, minWidth: 0 }}
        className="gap-4 items-center p-6 mx-auto rounded-lg shadow-lg"
      >
        <AlertDialogHeader className="mb-2 text-center w-full">
          <Heading className="text-foreground font-semibold text-lg">
            Admin
          </Heading>
        </AlertDialogHeader>
        
        {/* Desactivamos el scroll interno y permitimos que crezca de forma elástica */}
        <AlertDialogBody 
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={{ overflow: 'visible', width: '100%' }}
          className="mb-4 text-center w-full gap-4"
        >
          <Text className="text-sm text-muted-foreground mb-2">
            Ingresa la contraseña
          </Text>
          
          <Input variant="outline" size="md" className={`w-full ${errorMessage ? 'border-destructive' : ''}`}>
            <InputField 
              type="password" 
              placeholder="Contraseña"
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                if (errorMessage) setErrorMessage(""); 
              }}
              onChange={(e) => {
                setInputValue(e.target.value || "")
                if (errorMessage) setErrorMessage("");
              }}
              className="text-foreground"
            />
          </Input>

          {errorMessage !== "" && (
            <Text 
              style={{ color: '#ef4444', textAlign: 'left', width: '100%', marginTop: 6, fontSize: 12, fontWeight: '500' }}
              className="text-destructive text-left w-full mt-1 font-medium"
            >
              {errorMessage}
            </Text>
          )}
        </AlertDialogBody>
        
        <AlertDialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full justify-center">
          <Button 
            variant="outline" 
            onPress={handleCloseModal}
            className="w-full sm:w-auto px-[30px]"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
           
          <Button 
            onPress={handleIngresar}
            className="w-full sm:w-auto px-[30px]"
          >
            <ButtonText>Ingresar</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Login;
