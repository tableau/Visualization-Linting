float mu = 50;
float sd = 10;
int n = 50;
int samples = 20;

float[] sds = {15,20,25};
int[] ns = {25,15,5};
float[] mus = {55,65,75};
int[] outliers = {5,10,15};

void setup(){
  float[] dataA;
  float[] dataB;
  
  for(float s:sds){
    for(int i = 0;i<samples;i++){
      dataA = genData(n,mu,sd);
      dataB = genData(n,mu,s);
      printData(dataA,dataB,"data/sd/"+int(s)+"/"+i+".csv");
    }
  }
  
  for(int size:ns){
    for(int i = 0;i<samples;i++){
      dataA = genData(n,mu,sd);
      dataB = genData(size,mu,sd);
      printData(dataA,dataB,"data/n/"+size+"/"+i+".csv");
    }
  }
  
  for(float m:mus){
    for(int i = 0;i<samples;i++){
      dataA = genData(n,mu,sd);
      dataB = genData(n,m,sd);
      printData(dataA,dataB,"data/mu/"+int(m)+"/"+i+".csv");
    }
  }
  
  for(int os:outliers){
    for(int i = 0;i<samples;i++){
      dataA = genData(n,mu,sd);
      dataB = addOutliers(os,genData(n,mu,sd));
      printData(dataA,dataB,"data/os/"+os+"/"+i+".csv");
    }
  }
  
  System.out.println("done");
  exit();
}

float[] genData(int n, float m, float s){
  float[] data = new float[n];
  for(int i = 0;i<n;i++){
    data[i] = (randomGaussian()*s) + m;
  }
  return data;
}

float[] addOutliers(int n, float[] data){
  float[] newData = new float[data.length+n];
  arrayCopy(data,newData);
  float[] ovals = outlierVal(data);
  for(int i = data.length;i<newData.length;i++){
    newData[i] = random(ovals[0],ovals[1]);
  }
  return newData;
}

float[] outlierVal(float[] data){
  float[] sdata = sort(data);
  float q1 = sdata[round(sdata.length*0.25)];
  float q3 = sdata[round(sdata.length*0.75)];
  float iqr = q3-q1;
  return new float[]{q3 + (1.5 * iqr),q3 + (3.0 * iqr)};
}

void printData(float[] dataA, float[] dataB, String filename){
  String[] lines = new String[1 + dataA.length + dataB.length];
  lines[0] = "category,value";
  int index = 1;
  for(int i = 0;i<dataA.length;i++){
    lines[index] = "A," + dataA[i];
    index++;
  }
  for(int i = 0;i<dataB.length;i++){
    lines[index] = "B," + dataB[i];
    index++;
  }
  saveStrings(filename,lines);
}
