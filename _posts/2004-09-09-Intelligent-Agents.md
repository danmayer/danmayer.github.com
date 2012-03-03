---
layout: post
title: "Intelligent Agents"
category:
tags: []
---
{% include JB/setup %}
Well I had to write a little one page paper for AI class about agents so here it is incase anyone else is ever thinking about a simple little agent that plays a wierd cave game called Wumpus world. Also, I guess some of the Ideas are a little interesting. The code to run and test everything is provided in my extended entry if you want it. (The code isn't the prettiest or well commented seeing as I had other work to do and had to finish the entire assignement in less than two days, but it works and the smart agent does do better thant he simple one.)

Agents

I created the two agents, the dumb agent that was mostly random and the more intelligent agent. The dumb agent got an avg of -450 which was close to the naive agent the professor had coded up, which averaged -390. So everything with my world and agent seemed pretty close. I then began work on the intelligent agent. I found it significantly harder than expected to add features that improved performance. Many times adding rules that I thought would help improve the agents performance and these rules would actually result in far lower scores. After trying a few pretty simple ideas I developed what my final agent became. My final agent had an average score of -60 which wasn't great, but still significantly better than the dumb agent. I added one extra constraint to the game for fun, since I am a vegetarian I decided that I would never kill the Wumpus. So my algorithm would simple avoided the Wumpus in attempts to navigate to the gold. This lead to more impossible maps and therefor a lower overall score. It will still be interesting to see how my animal friendly agent performed in comparison to others.
My more intelligent agent worked on the right hand on the maze wall idea. I would go forward until i found a area that could present a problem. A problem being either a stench or a breeze, if this problem was found i would turn around and walk the other direction and then try a different route, with my right hand facing the problem. This worked well at avoiding pits since I also had a higher percent of the time the choice of moving forward, and always would move forward if there was no chance of danger. This quickly lead to the problem of certain pits providing an infinite loop. Lowering my score by getting in a safe, but useless route. To fix this if I encountered the same pit problem multiple times i would then just walk threw the sensed breeze in hopes that the pit was not the direction I was going. This could have been improved by first trying alternate routes around the pit, but could have then left the problem of many different infinite loops.
The improvement of the agent was significant and noticeable, but also illustrated the difficulties of simple relying on a simple set of rules. I think a more effective route would have been to have the agent slowly walk along any known safe route while mapping problem areas to his known portion of the map and only after exhausting all safe possibilities (and trying to create safe possibilities by killing the Wumpus) picking at random a unsafe point of passage that would lead to the most possible options for a next move.//Room.java
import java.util.Vector;

/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2004</p>
 * <p>Company: </p>
 * @author not attributable
 * @version 1.0
 */

public class Room {
  Vector attributes;

  public Room() {
    attributes = new Vector();
  }
}

//Wumpus.java
import java.util.Vector;
import java.io.*;
import java.util.*;

/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2004</p>
 * <p>Company: </p>
 * @author not attributable
 * @version 1.0
 */

public class Wumpus {
  //array for the world
  Room[][] world;
  //location of player
  int killed=0;
  int playX;
  int playY;
  int playDir;
  int oldDir;
  int around;
  int ardcnt;
  //location of wumpus
  int wumpusX;
  int wumpusY;
  //location of gold
  int goldX;
  int goldY;
  //for bumps
  String bump="";
  String arrow="";
  String scream="";
  //for making random numbers
  static Random generator;

  public Wumpus() {
    generator = new Random();
  }

  //creates and initializes the Wumpus World
  public void WumpusWorld()
  {
    //places player in room 1,1 facing right
    playX=0;
    playY=0;
    playDir=0;
    //sets initial
    wumpusX=0;
    wumpusY=0;
    goldX=0;
    goldY=0;
    bump="";
    arrow="";
    around=0;
    ardcnt=0;
    Room current = new Room();
    //creates 4 by 4 array ith each of the rooms
    world = new Room[4][4];
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 4; j++) {
        world[i][j] = new Room();
      }
    }
    //randomly select where the wampus is and place it
    while (wumpusX == 0 && wumpusY == 0) {
      wumpusX = generator.nextInt(4);
      wumpusY = generator.nextInt(4);
    }
    //System.out.println(wumpusX);
    //System.out.println(wumpusY);
    current = world[wumpusX][wumpusY];
    current.attributes.add("Wumpus");
    //add the stenches around
    addAround("Stench",wumpusX,wumpusY);
    //set the gold
    //randomly select but cant be in 1,1 or with wumpus
    while ( (goldX == 0 && goldY == 0) || (goldX == wumpusX && goldY == wumpusY)) {
      goldX = generator.nextInt(4);
      goldY = generator.nextInt(4);
    }
    //System.out.println(goldX);
    //System.out.println(goldY);
    current = world[goldX][goldY];
    current.attributes.add("glitter");
    //randomly add pits but not with the gold or in 1,1
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 4; j++) {
        //not in the first square
        if (i != 0 && j != 0) {
          //randly choose should there be a pit
          int rand = generator.nextInt(10);
          //.2 percent make the pit
          if (rand <= 1) {
            //make the pit
            current = world[i][j];
            current.attributes.add("pit");
            addAround("Breeze",i,j);
          }
        }
      }
    }
    //the world is done and has been successfully been created
  }

//adds the attribute around a point
   public void addAround(String attr, int x, int y)
   {
     Room current=new Room();
     //add the attribute around given point
    x--;
    if(x>=0)
    {
      current = world[x][y];
      current.attributes.add(attr);
    }
    x=x+2;
    if(x<=3)
    {
      current = world[x][y];
      current.attributes.add(attr);
    }
    x--;
    y--;
    if(y>=0)
   {
     current = world[x][y];
     current.attributes.add(attr);
   }
   y=y+2;
    if(y<=3)
    {
      current = world[x][y];
      current.attributes.add(attr);
    }
  }

  //removes attribute from given point
   public void removeAround(String attr, int x, int y)
   {
     //System.out.println("remove around x: "+x+"  y: "+y);
     Room current=new Room();
     //add the attribute around given point
    x--;
    //System.out.println("remove around x: "+x+"  y: "+y);
    if(x>=0)
    {
      current = world[x][y];
      current.attributes.remove(attr);
    }
    x=x+2;
    //System.out.println("remove around x: "+x+"  y: "+y);
    if(x<=3)
    {
      current = world[x][y];
      current.attributes.remove(attr);
    }
    x--;
    y--;
    //System.out.println("remove around x: "+x+"  y: "+y);
    if(y>=0)
   {
     current = world[x][y];
     current.attributes.remove(attr);
   }
   y=y+2;
   //System.out.println("remove around x: "+x+"  y: "+y);
    if(y<=3)
    {
      current = world[x][y];
      current.attributes.remove(attr);
    }
  }


//takes the current world state and the agents next action
  //returns the new world state and the cost of the action
  public int result(String action)
  {
    scream="";
    String bumps="";
    Room current=new Room();
    int retval=-99;
    //take care of left turns
    if(action.equalsIgnoreCase("turnLeft"))
    {
      turn(-1);
      retval=-1;
    }
    //take care of right turns
    if(action.equalsIgnoreCase("turnRight"))
    {
      turn(1);
      retval=-1;
    }
    //take care of move forward
    if(action.equalsIgnoreCase("forward"))
    {
      bumps=move(playDir);
      retval=-1;
      //check for pits and wumpus after moving
      current=world[playX][playY];
      for(int i=0;i<current.attributes.size();i++){
        if( ((String)current.attributes.get(i)).equalsIgnoreCase("pit"))
        {
          retval = -1000;
          //System.out.println("Fell in pit result fucntion");
          killed++;
        }
      }
      if(playX==wumpusX && playY==wumpusY){
        retval = -1000;
        //System.out.println("wumpus got me result fucntion");
        killed++;
      }
    }
    //get the gold
    if(action.equalsIgnoreCase("grab"))
    {
      current=world[playX][playY];
      for(int i=0;i<current.attributes.size();i++){
        if( ((String)current.attributes.get(i)).equalsIgnoreCase("glitter")){
          retval = 1000;
          current.attributes.remove("glitter");
          //System.out.println(current.attributes);
        }
      }
      if(retval!=1000){
        retval=-1;
      }
    }
    //checks the fire arrow and sees if it hits wumpus
    if(action.equalsIgnoreCase("fire")&&retval!=-1000)
    {
      retval = fire();
    }
    bump=bumps;
    return retval;
  }

  //does the arrow thing and returns 1000 for hit and -10 for miss
  public int fire()
  {
    int retval=-10;
    int x;
    int y;
    Room current=new Room();
    //0 is right
    if(playDir==0){
      x=playX+1;
      while(x<=3){
        current = world[x][playY];
        for(int i=0;i<current.attributes.size();i++){
          if( ((String)current.attributes.get(i)).equalsIgnoreCase("wumpus"))
            retval=-10;
            current.attributes.remove("wumpus");
            removeAround("stench",x,playY);
            scream="yes";
        }
        x++;
      }
    }
    //1 is up
    if(playDir==1){
      y=playY+1;
      while(y<=3){
        current = world[playX][y];
        for(int i=0;i<current.attributes.size();i++){
          if( ((String)current.attributes.get(i)).equalsIgnoreCase("wumpus"))
            retval=-10;
            current.attributes.remove("wumpus");
            removeAround("stench",playX,y);
            scream="yes";
        }
        y++;
      }
    }
    //2 is left
    if(playDir==2){
      x=playX-1;
      while(x>=0){
        current = world[x][playY];
        for(int i=0;i<current.attributes.size();i++){
          if( ((String)current.attributes.get(i)).equalsIgnoreCase("wumpus"))
            retval=-10;
            current.attributes.remove("wumpus");
            removeAround("stench",x,playY);
            scream="yes";
        }
         x--;
      }
    }
    //3 is down
    if(playDir==3){
      y=playY-1;
     while(y>=0){
       current = world[playX][y];
       for(int i=0;i<current.attributes.size();i++){
         if( ((String)current.attributes.get(i)).equalsIgnoreCase("wumpus"))
           retval=-10;
           current.attributes.remove("wumpus");
           removeAround("stench",playX,y);
           scream="yes";
       }
       y--;
     }
    }
    return retval;
  }

  //turns the person either right or left
  public void turn(int r)
  {
    //0 is right
    //1 is up
    //2 is left
    //3 is down
    oldDir=playDir;
    //turn right
    if(r==1){
      playDir--;
    }else{
      //turn left
      playDir++;
    }
    if(playDir==4)
      playDir=0;
    if(playDir==-1)
      playDir=3;
  }

  //moves the person forward
  //hears a bump if they hit a wall
  //if hits a wall dont move
  public String move(int d)
  {
    String retval="";
    //0 is right
    if(d==0){
      playX++;
    }
    //1 is up
    if(d==1){
      playY++;
    }
    //2 is left
    if(d==2){
      playX--;
    }
    //3 is down
    if(d==3){
      playY--;
    }
    if(playX>3){
      playX=3;
      retval="bump";
    }
    if(playY>3){
      playY=3;
      retval="bump";
    }
    if(playX<0){
      playX=0;
      retval="bump";
    }
    if(playY<0){
      playY=0;
      retval="bump";
    }
    return retval;
  }

  //does the dump agent stuff
  //looks at the world returns its action
  public String dumbAgent()
  {
    String retval="";
    boolean stenchy=false;
    boolean breeze=false;
    //get current senses
    Room current=world[playX][playY];
    for(int i=0;i<current.attributes.size();i++)
    {
      String temp=(String)current.attributes.get(i);
      if(temp.equalsIgnoreCase("stench")){
        if(arrow.equalsIgnoreCase("")){
          retval="fire";
          arrow="shot";
        }else{
          arrow="";
        }
      }
      if(temp.equalsIgnoreCase("glitter"))
        retval="grab";
    }
    if(retval.equalsIgnoreCase("")){
      int pick=generator.nextInt(3);
      //turn left
      if(pick==0){
        retval="turnLeft";
      }
      //turn right
      if(pick==1){
        retval="turnRight";
     }
     //move forward
     if(pick==2){
       retval="forward";
     }
    }
    return retval;
  }

  //does the smart agent stuff
  //when it comes to a stench or breeze it will try to go around it.
  //tries to go around things using the right hand maze rule
//looks at the world returns its action
public String SmartAgent()
{
  String retval="";
  boolean stenchy=false;
  boolean breeze=false;
  //get current senses
  Room current=world[playX][playY];
    for(int i=0;i<current.attributes.size();i++)
    {
      String temp=(String)current.attributes.get(i);
      if(temp.equalsIgnoreCase("stench")){
        stenchy=true;
      }
      if(temp.equalsIgnoreCase("glitter")){
        retval = "grab";
        //if there is glitter there is nothing else we would want to do
        return retval;
      }
      if(temp.equalsIgnoreCase("breeze"))
        breeze=true;
    }
    //first if you haven't moved and it is your first turn
    //just go forward
    if(playX==0 && playY==0 && playDir==0)
    {
      retval="forward";
    }
    //if you killed the wumpus move forward
    if(!scream.equalsIgnoreCase("")&& retval.equalsIgnoreCase(""))
    {
      if(breeze!=true){
        retval = "forward";
        return retval;
      }else{//it is dead but there might be a pit
          retval="turnLeft";
          around++;
      }
    }
      if(breeze==true){
        //System.out.print("breeze: ");
        //try to go around pits
        if(around==0 || around==3){
          //System.out.print("around 1 cnt is: "+ardcnt+": ");
          around=1;
          ardcnt++;
          if(ardcnt>11){
            around=0;
            retval= "forward";
          }else{
            //turn left
            retval = "turnLeft";
          }
        }
      }
      if(stenchy==true){
        //try to go around wumpus
        if (around == 0) {
          //System.out.print("around 1: ");
          around = 1;
          ardcnt++;
          if (ardcnt > 11) {
            around = 0;
            retval = "forward";
          }
          else {
            //turn left
            retval = "turnLeft";
          }
        }
      }
      if(retval.equalsIgnoreCase("")){
      //if it started going around something
      //finish going around it
      if(around==1){
          around=2;
          //System.out.print("around 2: ");
          retval="turnLeft";
        }else if(around==2){
          //turn right
          retval="forward";
          //System.out.print("around 3: ");
          around=3;
        }else if(around==3){
          around=0;
          //System.out.print("around 4: ");
          retval="turnRight";
        }
        //havent found something to do yet
        //go do something random and hope for the best hehe
        //but walk forward a little more often
        //if there is nothing sensed walk forward always
      if(retval.equalsIgnoreCase("")){
          int pick = generator.nextInt(3);
          //nothing to fear try a new block
        if(breeze==false && stenchy==false){
          retval = "forward";
          //System.out.print("no fear: ");
          pick=-1;
        }
        //System.out.print("random: ");
        //turn left
        if (pick == 0) {
          retval = "turnRight";
        }
        //turn right
        if (pick == 1) {
          retval = "turnRight";
        }
        //move forward
        if (pick >= 2) {
          retval = "forward";
        }
      }
    }
    //we have a decision but lets make sure  we wont try to walk into a walk
    //0 is right
    //1 is up
    //2 is left
    //3 is down
    //walking left off board
    if(playX==0 && playDir==2){
      retval = "turnRight";
      //System.out.print("wall: ");
    }
    //walking down off board
    if(playY==0 && playDir==3){
      retval = "turnRight";
      //System.out.print("wall: ");
    }
    if(playX==3 && playDir==0){
      retval = "turnRight";
      //System.out.print("wall: ");
    }
    if(playY==3 && playDir==1){
      retval = "turnRight";
      //System.out.print("wall: ");
    }
       //it wont walk into a wall go for it
    return retval;
}


  //this is to test and run the program
  public static void main(String args[]){
    Wumpus test;
    int score;
    int moves;
    int points;
    int avg=0;
    int times=0;
    String doA="";
    System.out.println("Starting Simulation");
    //System.out.println("Attributes are");
    //for (int i = 0; i < 4; i++) {
     //for (int j = 0; j < 4; j++) {
       //System.out.println(i+" , "+j+" : "+test.world[i][j].attributes);
     //}
   //}
   test = new Wumpus();

   while(times<10000){
     times++;
     test.WumpusWorld();
     score=0;
     moves=0;
     points=0;
     test.around=0;
     while ( (points != -1000 && points != 1000) && moves < 1000) {
       if (moves < 1000) {
         doA = test.dumbAgent();
         points = test.result(doA);
         //System.out.println("Action: "+doA+"   points: "+points+"    moves: " + moves);
         score = score + points;
       }
       moves++;
     }
     //System.out.println("Score: " + score);
     avg=avg+score;
   }
   System.out.println("Dumb agent average: "+avg/10000);

   //run the same tests with the smart agent yes 10000 more times
  times=0;
  avg=0;
  while(times<10000){
    times++;
    test.WumpusWorld();
    score=0;
    moves=0;
    points=0;
    while ( (points != -1000 && points != 1000) && moves < 1000) {
      if (moves < 1000) {
        doA = test.SmartAgent();
        points = test.result(doA);
        score = score + points;
       //System.out.println("Action: "+doA+"   points: "+points+"    moves: " + moves+"  score: "+score);
       //System.out.println("state["+test.playX+","+test.playY+","+test.playDir+"]: "+(test.world[test.playX][test.playY]).attributes);
      }
      moves++;
    }
    //System.out.println("Score: " + score);
    avg=avg+score;
  }
  System.out.println("Smart agent average: "+avg/10000);

  System.out.println("How many times were you killed out of 20000: "+test.killed);


}
}