    <?php

    $LocationCode = $_POST['LocationCode'];
	$rowID = $_POST['rowID'];
   
	
	set_include_path(get_include_path() . PATH_SEPARATOR . 'phpseclib');
	


	//echo ini_get('include_path');
	include('Net/SSH2.php');

	$host = '10.10.19.30'; 
	$port = 22;
	$username = 'chinnapat.c';
	$password = 'mamepkx';

	$targetNode = $LocationCode;
	$ssh = new Net_SSH2($host,$port);

	$round = 0;

	while(!$ssh->login($username, $password))
	{
			$ssh->disconnect();
			sleep(2);
			$ssh = new Net_SSH2($host,$port);
			$round++;
			if($round==20)
			{
				//echo 'Cannot connect to '.$host.",".$rowID.",".$LocationCode;
				$ssh->disconnect();
				break;
			}

	}
	/*if (!$ssh->login($username, $password)) {
	

		  echo 'Cannot connect to '.$host.",".$rowID.",".$LocationCode;
		  exit('Login Failed');
		  $ssh->disconnect();
	}*/
	if($round < 20)
	{
	
	
		$ssh->setTimeout(10);
	
		$ssh->read('~]$');
		$ssh->write("telnet ".$targetNode."\n");
		$ssh->read('>>User name:');
		
		if($ssh->isTimeout() === true)
		{
			echo "Node down !! ,".$rowID.",".$LocationCode;
			$ssh->write("\x03");
			$ssh->disconnect();
		}

		$ssh->write($username.'@'."3bb\n");
		$ssh->read('>>User password:');
		$ssh->write($password."\n");
		$ssh->read('>');
		$ssh->write("enable\n");
		$ssh->read('#');
		$ssh->write("config\n");
		$ssh->read('config)#');
	
		


		
	    for($i = 2; $i >= 0; $i--)
		{
				$ssh->write("interface emu ".$i."\n display power run info \n quit\n");

	
				$readResult = nl2br($ssh->read('%'));

				$readResult = substr( $readResult, strpos($readResult, "\n")+1 );
				$readResult = substr( $readResult, strpos($readResult, "\n")+1 );
				$readResult = substr( $readResult, strpos($readResult, "\n")+1 );

				//echo $readResult;
		
				$ACpos = strpos($readResult, 'AC voltage'	);
				$pos = strpos($readResult, 'DC   voltage'	);

				if ($pos === false) {
					if($i==0)
					{
						echo "EMU not found";
					}

				}
				else{
					//echo $pos;
					$ACvoltage = floatval(substr($readResult,$ACpos+20,6));
					$Status = "Cleared";

					if($ACvoltage < 200.0)
					{
						$Status = "Not clear";
					}
					else
					{
						$Status = "Cleared";
					}
					echo substr($readResult,$pos+18,6).",".$rowID.",".$LocationCode.",".$readResult.",".$Status;
					break;
				}
		} 
		$ssh->write("quit\n quit\ny\n \n");
		
		$ssh->disconnect();
	
}
	
	
	
	
 ?>